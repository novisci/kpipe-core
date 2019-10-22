module.exports = function (options) {
  if (!options || !options.type) {
    throw new Error('No reader backend specified in options.type')
  }

  // Backend readers return a function which creates new readable streams
  //  given a path
  let backend = null

  switch (options.type) {
    case 'fs': backend = require('./fs')(options); break
    case 's3': backend = require('./s3')(options); break
    case 'stdio': backend = require('./stdio')(options); break
    case 'kafka': backend = require('./kafka')(options); break
    case 'buffer': backend = require('./buffer')(options); break
    case 'random': backend = require('./random')(options); break
    default: throw new Error(`Unknown reader type "${options.type}`)
  }

  return (...args) => backend(...args)
}
