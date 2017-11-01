import fs from 'fs-extra'
import path from 'path'

import logging from '../../../server/controllers/logging'

// const MOCK_PRODUCT_PHOTO_PATH = path.resolve(path.join(__dirname,'./mockPhotos/products'))
const MOCK_CAROUSEL_PHOTO_PATH = path.resolve(path.join(__dirname, 'mockPhotos/carousel'))

module.exports = (Photos, Products) => {
  let insertQueries = []
  return fs
    .readdir(MOCK_CAROUSEL_PHOTO_PATH)
    .then((carouselPhotoFileNames) => {
      carouselPhotoFileNames.forEach((fileName) => {
        insertQueries.push(
          Photos.create({
            carousel: true,
            originalName: fileName,
            encoding: '7bit',
            mimeType: 'image/jpeg',
            size: fs.statSync(path.join(MOCK_CAROUSEL_PHOTO_PATH, fileName)).size,
            data: fs.readFileSync(path.join(MOCK_CAROUSEL_PHOTO_PATH, fileName))
          })
        )
      })
      return Promise
        .all(insertQueries)
        .then(() => Photos.find())
        .then((photo) => {
          photo.primary = true
          return photo.save()
        })
    })
    .then(() => {
      logging.warning('上傳 Carousel 圖檔資料... 成功')
      return Promise.resolve()
    })
    .catch((error) => {
      logging.error(error, 'resetDatabase/photo.js errored...')
      return Promise.resolve(error)
    })
}
