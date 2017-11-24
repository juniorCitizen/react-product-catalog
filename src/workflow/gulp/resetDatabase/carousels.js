import fs from 'fs-extra'
import path from 'path'
import piexif from 'piexifjs'
import Promise from 'bluebird'

const logging = require('../../../server/controllers/logging')

module.exports = (Carousels) => {
  let carouselPhotoPath = path.join(__dirname, 'mockPhotos/carousel')
  return fs
    .readdir(carouselPhotoPath)
    .then((photoFileNames) => {
      return Promise // run insertion queries in sequence
        .each(
          photoFileNames.map((photoFileName, index) => {
            return fs
              .readFile(path.join(carouselPhotoPath, photoFileName))
              .then(bufferedPhoto => {
                let data = null
                try {
                  data = Buffer.from(piexif.remove(bufferedPhoto.toString('binary')), 'binary')
                } catch (e) {
                // if no EXIF data found in the image
                // buffered data is written directly to the database
                  data = bufferedPhoto
                }
                return Carousels.create({
                  id: index,
                  order: index,
                  originalName: photoFileName,
                  encoding: '7bit',
                  mimeType: 'image/jpeg',
                  size: fs.statSync(path.join(carouselPhotoPath, photoFileName)).size,
                  data,
                  active: true
                })
              })
          }),
          (record, index, length) => {
            logging.warning(`carousel 檔案: ${record.get('originalName')} 進度: ${index + 1}/${length}`)
          })
        .then(Promise.resolve)
    })
    .then(logging.resolve('批次 carousel 圖檔寫入... 成功'))
    .catch(logging.reject('批次 carousel 圖檔寫入... 失敗'))
}
