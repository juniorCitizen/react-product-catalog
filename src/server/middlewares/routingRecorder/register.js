module.exports = (reference, note = 'Unspecified') => {
  return (req, res, next) => {
    if ('routingRecorder' in req) {
      req.routingRecorder.records.push({
        reference,
        note
      })
      return next()
    } else {
      res.status(500)
      let error = new Error('Router usage middleware data corrupted...')
      return next(error)
    }
  }
}
