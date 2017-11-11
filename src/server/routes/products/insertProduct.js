// const del = require('del')
const fs = require('fs-extra')
const uploads = require('multer')({
  dest: require('path').resolve('./upload')
})
const Promise = require('bluebird')

const db = require('../../controllers/database')
const eVars = require('../../config/eVars')
const routerResponse = require('../../controllers/routerResponse')

const validateJwt = require('../../middlewares/validateJwt')

module.exports = (() => {
  return [
    validateJwt,
    uploads.fields([
      { name: 'primaryPhoto', maxCount: 1 },
      { name: 'secondaryPhotos', maxCount: eVars.SECONDARY_PHOTO_COUNT_CEILING }
    ]),
    (req, res) => {
      return db.sequelize
        .transaction(trx => {
          let trxObj = { transaction: trx }
        }).catch((error) => routerResponse.json({
          req,
          res,
          statusCode: 500,
          error,
          message: 'error inserting product record'
        }))
    }
  ]
})()
