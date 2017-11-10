const path = require('path')

const routerResponse = require('../../controllers/routerResponse')

module.exports = (req, res) => {
  return routerResponse.image({
    res: res,
    statusCode: 200,
    mimeType: 'image/svg+xml',
    filePath: path.join(__dirname, `../../client/assets/${req.query.countryId}.svg`)
  })
}
