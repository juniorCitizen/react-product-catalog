const db = require('../../controllers/database')
const routerResponse = require('../../controllers/routerResponse')

module.exports = (() => {
  return [(req, res) => {
    return db.Flags
      .findById(req.params.countryId.toLowerCase())
      .then(svgData => routerResponse.imageBuffer({
        res,
        statusCode: 200,
        mimeType: 'image/svg+xml',
        dataBuffer: svgData.data
      }))
      .catch((error) => {
        return routerResponse.json({
          req,
          res,
          statusCode: 500,
          error,
          message: 'failure getting flag svg'
        })
      })
  }]
})()
