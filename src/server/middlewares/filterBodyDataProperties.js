// middleware to get only expected properties from the req.body
// and put the required data in req.filteredData
// also fields such as uuid field are automatically capitalized

const expectedFields = {
  series: ['name', 'order', 'publish'],
  products: ['code', 'name', 'specification', 'description', 'publish', 'seriesId'],
  photos: ['primary', 'productId', 'seriesId', 'publish'],
  carousels: ['order', 'primary']
}

const capEnforcedFields = {
  series: [],
  products: [],
  photos: ['productId'],
  carousels: []
}

module.exports = (modelReference) => {
  return (req, res, next) => {
    // create an empty obj to hold filtered data properties
    req.filteredData = {}
    // loop through fields according to the modelReference parameter value
    expectedFields[modelReference].forEach((fieldName) => {
      if (fieldName in req.body) {
        // if match is found, place into req.filteredData object
        req.filteredData[fieldName] = (() => {
          return capEnforcedFields[modelReference].indexOf(fieldName) >= 0
            ? req.body[fieldName].toUpperCase()
            : req.body[fieldName]
        })()
      }
    })
    if (
      Object.keys(req.filteredData).length === 0 &&
      req.filteredData.constructor === Object
    ) {
      // request body did not contain any expected field properties
      let message = 'At least one of the following fields must be present in the request body: '
      expectedFields[modelReference].forEach((fieldName) => {
        message += `'${fieldName}', `
      })
      message += message.slice(0, message.length - 2)
      res.status(400)
      let error = new Error('Missing data properties')
      error.customMessage = message
      return next(error)
    }
    return next()
  }
}
