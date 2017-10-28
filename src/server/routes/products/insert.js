// import del from 'del'
// import fs from 'fs'
import fs from 'fs-extra'
import Promise from 'bluebird'

import db from '../../controllers/database/database'
import routerResponse from '../../controllers/routerResponse'

function insertProductRecord(req, res) {
    // console.log(req.files)
    // console.log(req.body)
    return db.sequelize
        .transaction((trx) => { // initiate a db transaction
            let trxObj = { transaction: trx }
            return db // create record in products table
                .Products.create({
                    seriesId: req.body.seriesId,
                    code: req.body.code,
                    name: req.body.name,
                    type: req.body.type
                }, trxObj)
                .then((newProductRecord) => {
                    // create description record
                    return db.Descriptions.create({
                        productId: newProductRecord.id,
                        text: req.body.text
                    }, trxObj)
                })
                .then((newDescriptionRecord) => {
                    let photoQueries = []
                    // deal with primary photo
                    let primaryPhoto = req.files.primaryPhoto[0]
                    photoQueries.push(db.Photos.create({
                        productId: newDescriptionRecord.productId,
                        originalName: primaryPhoto.originalname,
                        encoding: primaryPhoto.encoding,
                        mimeType: primaryPhoto.mimetype,
                        size: primaryPhoto.size,
                        primary: true,
                        // write photo data to the blob field
                        data: fs.readFileSync(primaryPhoto.path)
                    }, trxObj))
                    // deal with secondary photos
                    req.files.secondaryPhotos.forEach((secondaryPhoto) => {
                        photoQueries.push(db.Photos.create({
                            productId: newDescriptionRecord.productId,
                            originalName: secondaryPhoto.originalname,
                            encoding: secondaryPhoto.encoding,
                            mimeType: secondaryPhoto.mimetype,
                            size: secondaryPhoto.size,
                            primary: false,
                            // write photo data to the blob field
                            data: fs.readFileSync(secondaryPhoto.path)
                        }, trxObj))
                    })
                    return Promise
                        .all(photoQueries)
                        .then(() => {
                            return fs.remove('./dist/server/upload')
                            // return del(['./dist/server/upload/**', '!./dist/server/upload'])
                        })
                        .then(() => {
                            return Promise.resolve(newDescriptionRecord.productId)
                        })
                })
        })
        .then((productId) => {
            return db.Products.findById(productId, {
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
            return routerResponse.json({
                pendingResponse: res,
                originalRequest: req,
                statusCode: 500,
                success: false,
                error: error,
                message: 'failed to create new product record'
            })
        })
}

module.exports = insertProductRecord
