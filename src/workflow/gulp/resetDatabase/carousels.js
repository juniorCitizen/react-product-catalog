import fs from 'fs-extra'
import path from 'path'
import Promise from 'bluebird'

require('dotenv').config()

const accessPath = process.env.NODE_ENV === 'development'
  ? path.resolve('./src/server')
  : path.resolve('./dist')

const logging = require(path.join(accessPath, 'controllers/logging'))

module.exports = (Carousels) => {
  let carouselPhotoPath = path.join(__dirname, 'mockPhotos/carousel')
  return fs
    .readdir(carouselPhotoPath)
    .then((photoFileNames) => {
      return Promise // run insertion queries in sequence
        .each(
          photoFileNames.map((photoFileName, index) => {
            return Carousels.create({
              primary: index === 0, // true if is the first element in array
              order: index,
              originalName: photoFileName,
              encoding: '7bit',
              mimeType: 'image/jpeg',
              size: fs.statSync(path.join(carouselPhotoPath, photoFileName)).size,
              data: fs.readFileSync(path.join(carouselPhotoPath, photoFileName))
            })
          }),
          (record, index, length) => {
            logging.warning(`carousel 檔案: ${record.get('originalName')} 進度: ${index + 1}/${length}`)
          })
        .then(() => {
          return Promise.resolve()
        })
        .catch((error) => {
          logging.error(error, '批次 carousel 圖檔寫入... 失敗')
          return Promise.reject(error)
        })
    })
    .then(() => {
      logging.warning('批次 carousel 圖檔寫入... 成功')
      return Promise.resolve()
    })
    .catch((error) => {
      logging.error(error, 'resetDatabase/carousel.js errored...')
      return Promise.reject(error)
    })
}
