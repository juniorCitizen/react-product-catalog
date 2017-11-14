const db = require('../../controllers/database')
// const logging = require('../../controllers/logging')
const routerResponse = require('../../controllers/routerResponse')

const validateJwt = require('../../middlewares/validateJwt')

module.exports = (() => {
  return [validateJwt, (req, res) => {
    return db.Photos
      .findById(req.params.photoId.toUpperCase())
      .then((targetRecord) => {
        return targetRecord.update({
          publish: !targetRecord.publish
        })
      })
      .then((updatedRecord) => {
        let data = updatedRecord.dataValues
        delete data.data
        return routerResponse.json({
          req,
          res,
          statusCode: 200,
          data
        })
      })
      .catch(error => routerResponse.json({
        req,
        res,
        statusCode: 200,
        error,
        message: 'photo publish state toggle failure'
      }))
  }]
})()
