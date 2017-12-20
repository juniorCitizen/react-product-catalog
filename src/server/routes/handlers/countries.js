const db = require('../../controllers/database')

const pagination = require('../../middlewares/pagination')

// free icons from https://icons8.com/icon/pack/free-icons/all
// return svg for missing photo substitue
const placeHolderSvg = `<?xml version="1.0" encoding="utf-8"?>
  <!-- Generator: Adobe Illustrator 18.1.1, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
  <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 32 32" enable-background="new 0 0 32 32" xml:space="preserve" width="96px" height="96px">
  <rect x="3" y="6" fill="none" stroke="#000000" stroke-width="2" stroke-miterlimit="10" width="26" height="20"/>
  <polyline fill="none" stroke="#000000" stroke-width="2" stroke-miterlimit="10" points="3,22.3 11,14.3 22.5,25.9 "/>
  <polyline fill="none" stroke="#000000" stroke-width="2" stroke-miterlimit="10" points="17.4,20.9 22,16.3 28.9,23.2 "/>
  <circle cx="24" cy="11" r="2"/>
  </svg>`

module.exports = {
  readAll: [ // GET /countries
    pagination(getRecordCount),
    getCountryRecords
  ],
  readOne: [
    sendFlagImage
  ],
  readRegions: [ // GET /regions
    getRegions
  ],
  // utilities
  getRecordCount,
  // common middlewares
  autoFindTarget
  // specialized middlewares
}

// find target country record indicated by the request route.param() with :countryId
function autoFindTarget (req, res, next, countryId) {
  let targetCountryId = countryId.toLowerCase()
  return db.Countries
    .scope({ method: ['flagOnly'] })
    .findById(targetCountryId)
    .then(targetCountry => {
      req.targetCountryId = targetCountryId
      req.targetCountry = targetCountry
      next()
      return Promise.resolve()
    })
    .catch(error => next(error))
}

// get country
function getCountryRecords (req, res, next) {
  let query = 'details' in req.query
    ? db.Countries.scope({ method: ['detailed'] })
    : db.Countries
  return query
    .findAll(req.queryOptions)
    .then(data => {
      req.resJson = { data }
      next()
      return Promise.resolve()
    })
    .catch(error => next(error))
}

function getRecordCount (includeDeleted = false) {
  return includeDeleted
    ? db.Countries.findAndCountAll({ paranoid: false })
    : db.Countries.findAndCountAll()
      .then(result => Promise.resolve(result.count))
      .catch(error => Promise.reject(error))
}

// route handler GET /regions
function getRegions (req, res, next) {
  return db.Countries
    .findAll({
      attributes: ['region'],
      group: 'region'
    })
    .map(data => data.region)
    .then(data => {
      req.resJson = { data }
      return next()
    })
    .catch(error => next(error))
}

function sendFlagImage (req, res, next) {
  if (req.params.countryId && !req.targetCountry) {
    res.status(404)
    req.resImage = { mimeType: 'image/svg+xml', data: placeHolderSvg }
  } else {
    req.resImage = { mimeType: 'image/svg+xml', data: Buffer.from(req.targetCountry.flagSvg) }
  }
  return next()
}
