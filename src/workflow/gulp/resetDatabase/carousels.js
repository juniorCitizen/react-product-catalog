import fs from 'fs-extra'
import path from 'path'
import Promise from 'bluebird'

import logging from '../../../server/controllers/logging'

module.exports = (Carousels) => {
  let carouselPhotoPath = path.resolve(path.join(__dirname, 'mockPhotos/carousel'))
  // let insertQueries = []
  return fs
    .readdir(carouselPhotoPath)
    .then((photoFileNames) => {
      return Promise // run insertion queries in sequence
        .each(
        // insertQueries,
          photoFileNames.map((photoFileName, index) => {
            return Carousels.create({
              primary: index === 0, // set to true, if it's the first index in the array
              displaySequence: index,
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
