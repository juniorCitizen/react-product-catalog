const db = require('../../controllers/database')
const routerResponse = require('../../controllers/routerResponse')

const validateJwt = require('../../middlewares/validateJwt')

module.exports = (() => {
  return [
    validateJwt,
    (req, res) => {
      return db.Photos
        .destroy({ where: { id: req.params.photoId.toUpperCase() } })
        .then((data) => routerResponse.json({
          req, res, statusCode: 200, data
        }))
        .catch(error => routerResponse.json({
          req, res, statusCode: 500, error
        }))
    }]
})()
