import dotEnv from 'dotenv'
import faker from 'faker'
import fs from 'fs-extra'
import path from 'path'
import piexif from 'piexifjs'
import Promise from 'bluebird'

const logging = require('../../../server/controllers/logging')

dotEnv.config()

module.exports = (Photos, Products, Series) => {
  let photoPath = path.join(__dirname, 'mockPhotos/products')
  let productIds = []
  let fileNames = []
  let fileCount = null
  let photoObjects = []
  return Products
    .findAll() // get product recordset from database
    .map(product => product.id) // extract a list of product id's
    .then(results => {
      productIds = results
      return fs.readdir(photoPath) // get a file listing from specified dir
    })
    .then(results => { // save file list related information
      fileNames = results
      fileCount = results.length
      return Promise.resolve()
    })
    .then(() => {
      // loop through each product
      productIds.forEach((productId, index) => {
        let photoIndexArray = []
        // randomly determine how many secondary photos
        let secondaryPhotoCount = faker.random.number({
          min: process.env.SECONDARY_PHOTO_COUNT_FLOOR,
          max: process.env.SECONDARY_PHOTO_COUNT_CEILING
        })
        // generate a random list of photoIndexes
        photoIndexArray.push(randomIndex(fileCount)) // primary photo
        for (let x = 0; x < secondaryPhotoCount; x++) { // secondary photos
          photoIndexArray.push(randomIndex(fileCount))
        }
        // loop through each item in the generated random index array
        photoIndexArray.forEach((photoIndex, index) => {
          // push a photo object without actual photo data
          photoObjects.push({
            primary: index === 0,
            originalName: fileNames[photoIndex],
            encoding: '7bit',
            mimeType: 'image/jpeg',
            size: fs.statSync(path.join(photoPath, fileNames[photoIndex])).size,
            data: null,
            productId
          })
        })
      })
      return Promise.resolve()
    })
    // run a series of promise in sequence
    // asynchronously reading photo file and create photo record
    // if not ran in sequence, system will run out of memory
    .then(() => Promise.each(photoObjects, (photoObject, index, length) => {
      if (index % 100 === 1) console.log(`進度: ${index - 1}/${length} 完成`)
      return fs
        .readFile(path.join(photoPath, photoObject.originalName))
        .then(bufferedPhoto => {
          photoObject.data = processExif(bufferedPhoto)
          return Photos.create(photoObject)
        })
    }))
    // assign seriesId to photos accordingly
    .then(() => Series.findAll()) // get series recordset from database
    // extract a list of series id's and map to an array of product search queries
    .map(series => Products.findOne({
      attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
      where: { seriesId: series.id }
    }))
    // runs the queries
    .then(searchQueries => Promise.all(searchQueries))
    .map(product => Photos.update(
      { seriesId: product.seriesId },
      { where: { primary: true, productId: product.id } }
    ))
    .then(updateQueries => Promise.all(updateQueries))
    .then(logging.resolve('批次圖檔寫入... 成功'))
    .catch(logging.reject('批次圖檔寫入... 失敗'))
}

function processExif (bufferedPhoto) {
  let data = null
  try {
    data = Buffer.from(removeExif(bufferedPhoto), 'binary')
    return data
  } catch (e) {
    // caught exception due to missing EXIF
    return bufferedPhoto
  }
}

function removeExif (bufferedPhoto) {
  return piexif.remove(bufferedPhoto.toString('binary'))
}

function randomIndex (arrayLength) {
  return faker.random.number({ min: 0, max: (arrayLength - 1) })
}
