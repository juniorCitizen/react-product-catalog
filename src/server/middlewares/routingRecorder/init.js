const uuidV4 = require('uuid/v4')

module.exports = (req, res, next) => {
  req.routingRecorder = {
    id: uuidV4().toUpperCase(),
    records: []
  }
  return next()
}
