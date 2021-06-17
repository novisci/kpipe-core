const { KafkaConsumer } = require('node-rdkafka')
const { Readable } = require('stream')

function topicConf (topic, seek) {
  if (!seek || typeof seek.partition === 'undefined') {
    return false
  }

  return {
    topic,
    partition: seek.partition,
    offset: seek.offset
  }
}

/***
 * options:
 *  groupid - consumer group id (if missing, a random one will be assigned)
 *  brokers - list of broker host:port addresses (optional)
 *  commit - true/false, commit received messages to consumer_offsets (default false)
 *  closeAtEnd - true/false stop consuming when end of partition is reached (default true)
 *  chunkSize - consume this many messages at a time (default 16)
 *  timeout - end consumption if no messages received within timeout (ms)
 *  fullMessage - true/false push entire kafka message (as json), not just its value (default false)
 *  debug - true/false enable debug logs from node-rdkafka consumer
 */
module.exports = function ({ brokers, groupid, commit, closeAtEnd, chunkSize, timeout, fullMessage, debug, quiet }) {
  brokers = brokers || 'localhost:9092'
  chunkSize = chunkSize || 16
  closeAtEnd = typeof closeAtEnd !== 'undefined' ? closeAtEnd : true
  groupid = groupid || 'cgroup-' + require('uid-safe').sync(6)

  let endOfPartition = null

  return (topic, position) => {
    position = position || {}

    (!quiet || debug) && console.info(`READ Kafka Topic (chunked): ${topic}/${groupid} ${JSON.stringify(position)}`)

    let nPushed = 0
    let isEnded = false
    let paused = false
    let lastMsgTime = null

    function endStream () {
      if (!isEnded) {
        isEnded = true
        stream.push(null)
      }
    }

    function consume () {
      if (paused || isEnded) {
        return
      }

      let count = chunkSize
      if (position.count) {
        count = Math.min(count, position.count - nPushed)
      }

      if (count === 0) {
        return
      }

      consumer.consume(count, (err, messages) => {
        if (err) {
          stream.emit('error', err)
          endStream()
          return
        }

        if (isEnded) {
          return
        }

        if (messages.length === 0) {
          if (timeout && (Date.now() - lastMsgTime) > timeout) {
            (!quiet || debug) && console.info('Consumer timeout expired, closing stream...')
            endStream()
          } else {
            setTimeout(() => consume(), 100)
          }
          return
        }

        // process.stderr.write('$')
        lastMsgTime = Date.now()
        const msgs = messages.map((m) => {
          if (fullMessage) {
            m.value = m.value.toString()
            m.key = m.key ? m.key.toString() : null
            return JSON.stringify(m)
          }
          return m.value.toString()
        })

        msgs.map((m) => stream.push(m))

        nPushed += msgs.length

        // let msg
        // while ((msg = msgs.shift()) !== false) {
        //   if (!stream.push(msg)) {
        //     break
        //   }
        // }
        // if (msgs.length > 0) {
        //   // Backpressure
        //   throw Error('Backpressure not handled in kafka consumer. Messages unsent: ' + msgs.length)
        // }

        const lastMsg = messages[messages.length - 1]

        // If commit specified, commit up to the last message received
        if (commit) {
          const cmt = {
            topic: lastMsg.topic,
            partition: lastMsg.partition,
            offset: lastMsg.offset + 1
          }
          // console.debug('committing ' + cmt.offset)
          consumer.commit(cmt)
        }

        // Check for end of parition (if closeAtEnd is true) and end consumption
        if (closeAtEnd && (typeof endOfPartition === 'number') && lastMsg.offset >= endOfPartition - 1) {
          (!quiet || debug) && console.info('End of partition, closing...')
          endStream()
          return false
        }

        // If position.count is specified, end consumption when we've consumed the
        //  required amount
        if (position.count && nPushed >= position.count) {
          (!quiet || debug) && console.info('KAFKA: reached end')
          endStream()
          return false
        }
      })
    }

    function installSigintTerminate () {
      process.once('SIGINT', (sig) => {
        process.stderr.write('\n')
        endStream()
      })
    }

    const stream = new Readable({
      objectMode: true,
      read: () => {
        if (isEnded) {
          return null
        }

        if (!consumer.isConnected()) {
          consumer.once('ready', () => {
            consume()
          })
        } else {
          consume()
        }
      }
    })

    stream.on('error', (err) => {
      console.error('STREAM event: error')
      console.error(err)
      endStream()
    })

    stream.on('close', () => {
      console.debug('STREAM event: close')
      isEnded = true
      disconnect(() => {})
    })

    stream.on('end', () => {
      console.debug('STREAM event: end')
      isEnded = true
      stream.destroy()
    })

    stream._destroy = function (err, cb) {
      console.debug('_destroy')
      disconnect((e) => {
        if (e) {
          return cb(e)
        }
        cb(err)
      })
    }

    function disconnect (cb) {
      if (consumer && consumer.isConnected()) {
        consumer.disconnect((err) => {
          if (err) {
            console.error(err)
          }
          (!quiet || debug) && console.info('Consumer disconnected')
          cb(err)
        })
      } else {
        cb()
      }
    }

    const opts = {
      'client.id': 'kpipe',
      'metadata.broker.list': brokers,
      'group.id': groupid,
      'enable.auto.commit': false,
      // 'message.timeout.ms': 10000, (?? producer only)
      // 'auto.commit.interval.ms': 15,
      'socket.keepalive.enable': true
      // 'debug': 'consumer,cgrp,topic,fetch',
      // 'enable.partition.eof': true
    }

    if (debug) {
      opts.debug = 'consumer,cgrp,topic,fetch'
    }

    const consumer = KafkaConsumer(opts, {
      'auto.offset.reset': 'earliest' // 'latest',
    })

    consumer.on('event.log', (log) => {
      console.debug(log.message)
    })

    consumer.on('event.error', (err) => {
      stream.emit('error', err)
    })

    consumer.on('unsubscribed', () => {
      // Invalidate the stream when we unsubscribe
      endStream()
    })

    // consumer.setDefaultConsumeTimeout(1000)

    function cbConnect (err, metadata) {
      if (err) {
        console.error('FAILED connect')
        stream.emit('error', err)
        return
      }

      consumer.isConnecting = false

      try {
        // Subscribe to the topics as well so we will be ready
        // If this throws the stream is invalid
        const off = topicConf(topic, position)
        if (off) {
          (!quiet || debug) && console.info('CONSUMER assign: ', off)
          consumer.queryWatermarkOffsets(topic, off.partition, 1000, (err, marks) => {
            if (err) {
              stream.emit('error', err)
              return
            }
            endOfPartition = marks.highOffset
            (!quiet || debug) && console.info('End of partition: ' + endOfPartition)
            if (closeAtEnd && endOfPartition <= off.offset) {
              (!quiet || debug) && console.info('Partition does not contain offset and closeAtEnd is set -- ending stream')
              endStream()
              return
            }
            consumer.assign([off])
          })
        } else {
          (!quiet || debug) && console.info('CONSUMER subscribe: ', topic)
          consumer.subscribe([topic])
          installSigintTerminate()
        }

        // start the flow of data
        stream.read()
      } catch (e) {
        stream.emit('error', e)
      }
    }

    consumer.isConnecting = true
    consumer.connect({}, cbConnect)

    return stream
  }
}
