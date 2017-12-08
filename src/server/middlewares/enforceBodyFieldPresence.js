module.exports = (expectedFieldNameArray) => {
  return (req, res, next) => {
    expectedFieldNameArray.forEach(fieldName => {
      if (!(fieldName in req.body)) {
        res.status(400)
        let error = new Error(`Expected field '${fieldName}' missing in request body`)
        return next(error)
      }
    })
    return next()
  }
}
