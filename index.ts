module.exports = {
  Reader: require('./reader'),
  Writer: require('./writer'),
  KafkaAdmin: require('./src/kafka/admin'),
  KafkaProducer: require('./src/kafka/producer')
}