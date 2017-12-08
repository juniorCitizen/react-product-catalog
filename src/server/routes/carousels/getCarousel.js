const eVars = require('../../config/eVars')

const db = require('../../controllers/database')

const setQueryBaseOptions = require('../../middlewares/setQueryBaseOptions')('carousels')
const paginationProcessing = require('../../middlewares/paginationProcessing')

// free icons from https://icons8.com/icon/pack/free-icons/all
const placeHolder = `<?xml version="1.0" encoding="utf-8"?>
<!-- Generator: Adobe Illustrator 18.1.1, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 32 32" enable-background="new 0 0 32 32" xml:space="preserve" width="96px" height="96px">
<rect x="3" y="6" fill="none" stroke="#000000" stroke-width="2" stroke-miterlimit="10" width="26" height="20"/>
<polyline fill="none" stroke="#000000" stroke-width="2" stroke-miterlimit="10" points="3,22.3 11,14.3 22.5,25.9 "/>
<polyline fill="none" stroke="#000000" stroke-width="2" stroke-miterlimit="10" points="17.4,20.9 22,16.3 28.9,23.2 "/>
<circle cx="24" cy="11" r="2"/>
</svg>`

module.exports = [
  setQueryBaseOptions,
  (req, res, next) => {
    return db.Carousels
      .findAndCountAll()
      .then(result => {
        req.dataSourceRecordCount = result.count
        next()
        return Promise.resolve()
      })
  },
  paginationProcessing,
  (req, res, next) => {
    return db.Carousels
      .findAll(req[eVars.SYS_REF].queryOptions)
      .then(data => {
        // if pagination url query is set, only get one photo
        if ('linkHeader' in req) {
          req.resImage = data.length === 0
            ? { mimeType: 'image/svg+xml', data: Buffer.from(placeHolder) }
            : { mimeType: data[0].mimeType, data: Buffer.from(data[0].data) }
          next()
        } else { // get a list of existing carousel without photo data
          req.resJson = { data }
          next()
        }
        return Promise.resolve()
      })
      .catch(error => next(error))
  }
]
