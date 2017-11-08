const db = require('../../controllers/database/database')
const routerResponse = require('../../controllers/routerResponse')

const validateJwt = require('../../middlewares/validateJwt')

module.exports = {
}

function validateDisplaySequence (req, res, next) {
  return db.Series
    .findAll()
    .then(seriesDataset => {
      if (req.params.displaySequence > seriesDataset.length) {
        req.displaySequence = seriesDataset.length
      } else if (req.params.displaySequence < 0) {
        req.displaySequence = 0
      } else {
        req.displaySequence = req.params.displaySequence
      }
      next()
      return Promise.resolve()
    })
    .catch(error => routerResponse.json({
      req: req,
      res: res,
      statusCode: 500,
      error: error,
      message: 'updateSeries.js determineDisplaySequence() errored'
    }))
}
