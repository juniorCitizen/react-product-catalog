import dotEnv from 'dotenv'
import faker from 'faker'
import fs from 'fs-extra'
import path from 'path'
import piexif from 'piexifjs'
import Promise from 'bluebird'

const logging = require('../../../server/controllers/logging')

dotEnv.config()

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
              return fs
                .readFile(path.join(productPhotoPath, photoFileNames[photoIndex]))
                .then(bufferedPhoto => {
                  let data = null
                  try {
                    data = Buffer.from(piexif.remove(bufferedPhoto.toString('binary')), 'binary')
                  } catch (e) {
                    logging.warning(`${photoFileNames[photoIndex]} does not have EXIF information attached`)
                    data = bufferedPhoto
                  }
                  insertQueries.push(
                    Photos.create({
                      primary: index === 0, // set to true, if it's the first index in the array
                      originalName: photoFileNames[photoIndex],
                      encoding: '7bit',
                      mimeType: 'image/jpeg',
                      size: fs.statSync(path.join(productPhotoPath, photoFileNames[photoIndex])).size,
                      data,
                      active: true,
                      productId: product.get('id')
                    })
                  )
                  return Promise.resolve()
                })
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
              ).catch(logging.reject('批次圖檔寫入... 失敗'))
            })
            .then((representativeProducts) => {
              // get a list of photos of these products
              // and update the photo with the seriesId
              // purpose: indicate the representative photo of each series
              return Promise.all(
                representativeProducts.map((product) => {
                  return Photos.update(
                    { seriesId: product.seriesId },
                    { where: { primary: true, productId: product.id } }
                  )
                })
              ).catch(logging.reject('建立產品類別代表圖檔參照... 失敗'))
            })
        })
        .then(Promise.resolve)
        .catch(Promise.reject)
    })
    .then(logging.resolve('批次圖檔寫入... 成功'))
    .catch(logging.reject('批次圖檔寫入... 失敗'))
}

function randomNumberFromRange (floor, ceiling) {
  return faker.random.number({ min: floor, max: ceiling })
}
