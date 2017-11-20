const logging = require('../../controllers/logging')

module.exports = (req, res, next) => {
  if (req.routingRecorder.records.length > 0) {
    logging.warning(`${req.method} ${req.route.path} [id: ${req.routingRecorder.id}], had taken the following paths:`)
    req.routingRecorder.records.forEach((routeTaken, index) => {
      logging.warning(`  ${index + 1}: ${routeTaken.reference} - ${routeTaken.note}`)
    })
  }
  return next()
}
