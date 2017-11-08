import faker from 'faker'
import fs from 'fs-extra'
import path from 'path'
import Promise from 'bluebird'

require('dotenv').config()

const accessPath = process.env.NODE_ENV === 'development'
  ? path.resolve('./src/server')
  : path.resolve('./dist')

const logging = require(path.join(accessPath, 'controllers/logging'))

module.exports = (Photos, Products, Series) => {
  let productPhotoPath = path.join(__dirname, 'mockPhotos/products')
  let insertQueries = []
  return Products
    .findAll() // get product data from database
    .then((products) => {
      // read mock product photos directory for a file listing
      return fs
        .readdir(productPhotoPath)
        .then((photoFileNames) => {
          let photoCount = photoFileNames.length
          // loop through each product in the database
          products.forEach((product) => {
            // declare an array to hold the index of photos to be inserted to the db
            // (it is initialized with one random index to start with)
            let photoIndexArray = [randomNumberFromRange(0, (photoCount - 1))]
            // randomly decide how many secondary photos to be inserted
            let secondaryPhotoCount = randomNumberFromRange(
              parseInt(process.env.SECONDARY_PHOTO_COUNT_FLOOR),
              parseInt(process.env.SECONDARY_PHOTO_COUNT_CEILING)
            )
            for (let counter = 0; counter < secondaryPhotoCount; counter++) {
              // for each 2ndary photo to be inserted, push another random photo index on to the array
              photoIndexArray.push(randomNumberFromRange(0, (photoCount - 1)))
            }
            // for each index in the array, push an insertion query
            photoIndexArray.forEach((photoIndex, index) => {
              insertQueries.push(
                Photos.create({
                  productId: product.get('id'),
                  primary: index === 0, // set to true, if it's the first index in the array
                  originalName: photoFileNames[photoIndex],
                  encoding: '7bit',
                  mimeType: 'image/jpeg',
                  size: fs.statSync(path.join(productPhotoPath, photoFileNames[photoIndex])).size,
                  data: fs.readFileSync(path.join(productPhotoPath, photoFileNames[photoIndex])),
                  publish: true
                })
              )
            })
          })
          return Promise.resolve()
        })
    })
    .then(() => {
      return Promise // run the insertion queries
        .each(insertQueries, (record, index, length) => {
          logging.warning(`檔案: ${record.get('originalName')} 進度: ${index + 1}/${length}`)
        })
        .then(() => {
          return Series
            .findAll()
            .map(series => series.id) // get a list of series id
            .then((seriesIdList) => {
              // run queries and find one product in each series
              return Promise.all(
                seriesIdList.map((seriesId) => {
                  return Products.find({ where: { seriesId: seriesId } })
                })
              ).catch((error) => {
                logging.error(error, '批次圖檔寫入... 失敗')
                return Promise.reject(error)
              })
            })
            .then((representativeProducts) => {
              // get a list of photos of these products
              // and update the photo with the seriesId
              // purpose: indicate the representative photo of each series
              return Promise.all(
                representativeProducts.map((product) => {
                  return Photos.update({
                    seriesId: product.seriesId
                  }, {
                    where: {
                      primary: true,
                      productId: product.id
                    }
                  })
                })
              ).catch((error) => {
                logging.error(error, '建立產品類別代表圖檔參照... 失敗')
                return Promise.reject(error)
              })
            })
        })
        .then(() => {
          return Promise.resolve()
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    })
    .then(() => {
      logging.warning('批次圖檔寫入... 成功')
      return Promise.resolve()
    })
    .catch((error) => {
      logging.error(error, 'resetDatabase/photo.js errored...')
      return Promise.reject(error)
    })
}

function randomNumberFromRange (floor, ceiling) {
  return faker.random.number({ min: floor, max: ceiling })
}
