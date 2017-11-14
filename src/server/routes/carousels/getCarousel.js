const db = require('../../controllers/database')
const routerResponse = require('../../controllers/routerResponse')

module.exports = (() => {
  return [(req, res) => {
    return db.Carousels
      .findById(req.params.carouselId)
      .then(carousel => routerResponse.imageBuffer({
        res,
        statusCode: 200,
        mimeType: carousel.mimeType,
        dataBuffer: carousel.data
      }))
      .catch(error => routerResponse.json({
        req,
        res,
        statusCode: 500,
        error
      }))
  }]
})()
