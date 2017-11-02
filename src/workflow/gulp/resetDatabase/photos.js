import faker from 'faker'
import fs from 'fs-extra'
import path from 'path'
import Promise from 'bluebird'

import logging from '../../../server/controllers/logging'

const MOCK_PRODUCT_PHOTO_PATH = path.resolve(path.join(__dirname, './mockPhotos/products'))
const MOCK_CAROUSEL_PHOTO_PATH = path.resolve(path.join(__dirname, 'mockPhotos/carousel'))
const MIN_SECONDARY_PHOTO_COUNT = 1
const MAX_SECONDARY_PHOTO_COUNT = 3

module.exports = (Photos, Products) => {
  let insertQueries = []
  // read mock carousel photos directory for a file listing
  return fs
    .readdir(MOCK_CAROUSEL_PHOTO_PATH)
    .then((photoFileNames) => {
      photoFileNames.forEach((fileName, index) => {
        // for each photo file, push a insertion query to the photos table
        insertQueries.push(
          Photos.create({
            carousel: true,
            primary: index === 0, // set to true, if it's the first index in the array
            originalName: fileName,
            encoding: '7bit',
            mimeType: 'image/jpeg',
            size: fs.statSync(path.join(MOCK_CAROUSEL_PHOTO_PATH, fileName)).size,
            data: fs.readFileSync(path.join(MOCK_CAROUSEL_PHOTO_PATH, fileName))
          })
        )
      })
      return Promise.resolve()
    })
    .then(() => Products.findAll()) // get product data from database
    .then((products) => {
      // read mock product photos directory for a file listing
      return fs.readdir(MOCK_PRODUCT_PHOTO_PATH)
        .then((photoFileNames) => {
          let photoCount = photoFileNames.length
          // loop through each product in the database
          products.forEach((product) => {
            // declare an array to hold the index of photos to be inserted to the db
            // it is initialized with one random index to start with
            let photoIndexArray = [randomNumberFromRange(0, (photoCount - 1))]
            // randomly decide how many secondary photos to be inserted
            let secondaryPhotoCount = randomNumberFromRange(MIN_SECONDARY_PHOTO_COUNT, MAX_SECONDARY_PHOTO_COUNT)
            for (let counter = 0; counter < secondaryPhotoCount; counter++) {
              // for each 2ndary photo to be inserted, push another random photo index on to the array
              photoIndexArray.push(randomNumberFromRange(0, (photoCount - 1)))
            }
            // for each index in the array, push an insertion query
            photoIndexArray.forEach((photoIndex, index) => {
              insertQueries.push(
                Photos.create({
                  primary: index === 0, // set to true, if it's the first index in the array
                  originalName: photoFileNames[photoIndex],
                  encoding: '7bit',
                  mimeType: 'image/jpeg',
                  size: fs.statSync(path.join(MOCK_PRODUCT_PHOTO_PATH, photoFileNames[photoIndex])).size,
                  data: fs.readFileSync(path.join(MOCK_PRODUCT_PHOTO_PATH, photoFileNames[photoIndex]))
                })
              )
            })
          })
          return Promise.resolve()
        })
    })
    .then(() => {
      // run the list of insertion queries
      return Promise
        .each(insertQueries, (record, index, length) => {
          logging.warning(`檔案: ${record.get('originalName')} 進度: ${index}/${length}`)
        })
        .then(() => {
          logging.warning('批次圖檔寫入... 成功')
          return Promise.resolve()
        })
        .catch((error) => {
          logging.error(error, '批次圖檔寫入... 失敗')
          return Promise.reject(error)
        })
    })
    .catch((error) => {
      logging.error(error, 'resetDatabase/photo.js errored...')
      return Promise.reject(error)
    })
}

function randomNumberFromRange (floor, ceiling) {
  return faker.random.number({ min: floor, max: ceiling })
}
