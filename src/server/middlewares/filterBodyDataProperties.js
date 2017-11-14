const routerResponse = require('../controllers/routerResponse')

const expectedFields = {
  series: ['name', 'order', 'publish'],
  products: ['code', 'name', 'specification', 'description', 'publish', 'seriesId'],
  photos: ['primary', 'productId', 'seriesId', 'publish']
}

const capitalizationEnforcedFields = {
  series: [],
  products: ['seriesId'],
  photos: ['productId', 'seriesId']
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
          if (fieldName.indexOf(capitalizationEnforcedFields[modelReference]) === -1) {
            return req.body[fieldName]
          } else {
            return req.body[fieldName].toUpperCase()
          }
        })()
      }
    })
    if (Object.keys(req.filteredData).length === 0 && req.filteredData.constructor === Object) {
      // respond with error 400, if request body did not contain any expected field properties
      let message = 'at least one of the following fields must be present in the request body: '
      expectedFields[modelReference].forEach((fieldName) => {
        message += `'${fieldName}', `
      })
      message += message.slice(0, message.length - 2)
      routerResponse.json({
        req,
        res,
        statusCode: 400,
        message: message
      })
      next('REQUEST_BODY_EMPTY')
    }
    next()
  }
}
