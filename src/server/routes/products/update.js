// import del from 'del'
// import fs from 'fs'
import fs from 'fs-extra'
import Promise from 'bluebird'

import db from '../../controllers/database/database'
import routerResponse from '../../controllers/routerResponse'

function updateProductRecord (req, res) {
  // console.log(req.files)
  // console.log(req.body)
  return db.sequelize
    .transaction((trx) => {
      let trxObj = { transaction: trx }
      return db.Products
        .findById(req.body.id)
        .then((product) => {
          if ('code' in req.body) {
            product.code = req.body.code.toUpperCase()
          }
          if ('name' in req.body) {
            product.name = req.body.name
          }
          return product
            .save(trxObj)
            .then(() => {
              return db.Descriptions.findOne({
                where: {
                  productId: req.body.id
                }
              })
            })
        })
        .then((description) => {
          if ('text' in req.body) {
            description.text = req.body.text
          }
          return description.save(trxObj)
        })
        .then(() => {
          if ('primaryPhoto' in req.files) {
            return db.Photos
              .destroy({
                where: {
                  productId: req.body.id,
                  primary: true
                }
              }, trxObj)
              .then(() => {
                return db.Photos
                  .create({
                    productId: req.body.id,
                    originalName: req.files.primaryPhoto[0].originalname,
                    encoding: req.files.primaryPhoto[0].encoding,
                    mimeType: req.files.primaryPhoto[0].mimetype,
                    size: req.files.primaryPhoto[0].size,
                    primary: true,
                    data: fs.readFileSync(req.files.primaryPhoto[0].path)
                  })
              })
          } else {
            return Promise.resolve()
          }
        })
        .then(() => {
          if ('photoRemovalList' in req.body) {
            console.log(req.body.photoRemovalList)
            let conditions = {
              where: {
                id: { $in: req.body.photoRemovalList }
              }
            }
            return db.Photos.destroy(conditions, trxObj)
          } else if ('secondaryPhotos' in req.files) {
            let conditions = {
              where: {
                productId: req.body.id,
                primary: false
              }
            }
            return db.Photos
              .destroy(conditions, trxObj)
              .then(() => {
                let photoData = []
                req.files.secondaryPhotos.forEach((secondaryPhoto) => {
                  photoData.push({
                    productId: req.body.id,
                    originalName: secondaryPhoto.originalname,
                    encoding: secondaryPhoto.encoding,
                    mimeType: secondaryPhoto.mimetype,
                    size: secondaryPhoto.size,
                    primary: false,
                    data: fs.readFileSync(secondaryPhoto.path)
                  })
                })
                return db.Photos.bulkCreate(photoData, trxObj)
              })
          } else {
            return Promise.resolve()
          }
        })
    })
    .then(() => {
      return fs.remove('./dist/server/upload')
      // return del(['./dist/server/upload/**', '!./dist/server/upload'])
    })
    .then(() => {
      return db.Products.findById(req.body.id, {
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'deletedAt']
        },
        where: {
          deletedAt: null
        },
        include: [{
          model: db.Descriptions,
          attributes: {
            exclude: [
              'createdAt',
              'updatedAt',
              'deletedAt'
            ]
          },
          where: {
            deletedAt: null
          }
        }, {
          model: db.Photos,
          attributes: {
            exclude: [
              'data',
              'createdAt',
              'updatedAt',
              'deletedAt'
            ]
          },
          where: {
            deletedAt: null
          }
        }],
        order: [
          [db.Photos, 'primary', 'DESC']
        ]
      })
    })
    .then((productRecord) => {
      return routerResponse.json({
        pendingResponse: res,
        originalRequest: req,
        statusCode: 200,
        success: true,
        data: productRecord
      })
    })
    .catch((error) => {
      console.log(error.name)
      console.log(error.message)
      console.log(error.stack)
      return routerResponse.json({
        pendingResponse: res,
        originalRequest: req,
        statusCode: 500,
        success: false,
        error: error,
        message: 'failed to update product record'
      })
    })
}

module.exports = updateProductRecord
