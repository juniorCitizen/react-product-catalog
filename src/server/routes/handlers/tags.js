const multer = require('multer')

const db = require('../../controllers/database')

const pagination = require('../../middlewares/pagination')
const validateJwt = require('../../middlewares/validateJwt')

const colors = ['AliceBlue', 'AntiqueWhite', 'Aqua', 'Aquamarine', 'Azure', 'Beige', 'Bisque', 'Black', 'BlanchedAlmond', 'Blue', 'BlueViolet', 'Brown', 'BurlyWood', 'CadetBlue', 'Chartreuse', 'Chocolate', 'Coral', 'CornflowerBlue', 'Cornsilk', 'Crimson', 'Cyan', 'DarkBlue', 'DarkCyan', 'DarkGoldenRod', 'DarkGray', 'DarkGrey', 'DarkGreen', 'DarkKhaki', 'DarkMagenta', 'DarkOliveGreen', 'Darkorange', 'DarkOrchid', 'DarkRed', 'DarkSalmon', 'DarkSeaGreen', 'DarkSlateBlue', 'DarkSlateGray', 'DarkSlateGrey', 'DarkTurquoise', 'DarkViolet', 'DeepPink', 'DeepSkyBlue', 'DimGray', 'DimGrey', 'DodgerBlue', 'FireBrick', 'FloralWhite', 'ForestGreen', 'Fuchsia', 'Gainsboro', 'GhostWhite', 'Gold', 'GoldenRod', 'Gray', 'Grey', 'Green', 'GreenYellow', 'HoneyDew', 'HotPink', 'IndianRed', 'Indigo', 'Ivory', 'Khaki', 'Lavender', 'LavenderBlush', 'LawnGreen', 'LemonChiffon', 'LightBlue', 'LightCoral', 'LightCyan', 'LightGoldenRodYellow', 'LightGray', 'LightGrey', 'LightGreen', 'LightPink', 'LightSalmon', 'LightSeaGreen', 'LightSkyBlue', 'LightSlateGray', 'LightSlateGrey', 'LightSteelBlue', 'LightYellow', 'Lime', 'LimeGreen', 'Linen', 'Magenta', 'Maroon', 'MediumAquaMarine', 'MediumBlue', 'MediumOrchid', 'MediumPurple', 'MediumSeaGreen', 'MediumSlateBlue', 'MediumSpringGreen', 'MediumTurquoise', 'MediumVioletRed', 'MidnightBlue', 'MintCream', 'MistyRose', 'Moccasin', 'NavajoWhite', 'Navy', 'OldLace', 'Olive', 'OliveDrab', 'Orange', 'OrangeRed', 'Orchid', 'PaleGoldenRod', 'PaleGreen', 'PaleTurquoise', 'PaleVioletRed', 'PapayaWhip', 'PeachPuff', 'Peru', 'Pink', 'Plum', 'PowderBlue', 'Purple', 'Red', 'RosyBrown', 'RoyalBlue', 'SaddleBrown', 'Salmon', 'SandyBrown', 'SeaGreen', 'SeaShell', 'Sienna', 'Silver', 'SkyBlue', 'SlateBlue', 'SlateGray', 'SlateGrey', 'Snow', 'SpringGreen', 'SteelBlue', 'Tan', 'Teal', 'Thistle', 'Tomato', 'Turquoise', 'Violet', 'Wheat', 'White', 'WhiteSmoke', 'Yellow', 'YellowGreen']

module.exports = {
  availableColors: [ // GET /availableColors
    availableColors
  ],
  readAll: [ // GET /tags
    pagination(getRecordCount),
    getRecords
  ],
  insert: [ // POST /tags
    multer().none(),
    validateJwt({ staff: true }),
    nextAvailableId,
    insertRecord
  ],
  patch: [ // PATCH /tags/:tagId
    validateJwt({ staff: true }),
    determineProxyTarget,
    findTarget('params', true),
    sendTargetTagData
  ],
  delete: [ // DELETE /tags/:tagId
    rejectInvalidTargetRequest,
    validateJwt({ staff: true }),
    deleteRecord
  ],
  // utilities
  getRecordCount,
  // common middlewares
  autoFindTarget,
  findTarget,
  // specialized middlewares
  nextAvailableId
}

// find target tag record indicated by the request route.param() with :tagId
function autoFindTarget (req, res, next, tagId) {
  let targetTagId = tagId.toUpperCase()
  return db.Tags
    .findById(targetTagId)
    .then(targetTag => {
      req.targetTagId = targetTagId
      req.targetTag = targetTag
      next()
      return Promise.resolve()
    })
    .catch(error => next(error))
}

// route handler GET /tagColors
function availableColors (req, res, next) {
  req.resJson = { data: colors }
  return next()
}

// route handler DELETE /tags/:tagId
function deleteRecord (req, res, next) {
  return db.Tags
    .destroy({ where: { id: req.targetTag.id } })
    .then(data => {
      req.resJson = { data }
      next()
      return Promise.resolve()
    })
    .catch(error => next(error))
}

// patch route proxy function
function determineProxyTarget (req, res, next) {
  let urlQuery = Object.keys(req.query)[0]
  let error = new Error(`unidentified url query element: '${urlQuery}'`)
  switch (urlQuery) {
    case 'color':
      return patchColor(req, res, next)
    default:
      res.status(400)
      return next(error)
  }
}

// get the target tag
function findTarget (source = 'params', failIfNotExist = false, failIfUndeclared = false) {
  return (req, res, next) => {
    let targetTagId = null
    if (!('tagId' in req[source])) {
      if (failIfUndeclared) {
        res.status(400)
        let error = new Error(`Target tagId must be declared at req.${source}`)
        return next(error)
      }
      req.targetTagId = null
      req.targetTag = null
      return next()
    } else {
      targetTagId = parseInt(req[source].tagId)
      return db.Tags
        .findById(targetTagId)
        .then(targetTag => {
          if (!targetTag && failIfNotExist) {
            res.status(400)
            let error = new Error(`Target product (id: ${targetTagId}) does not exist`)
            return Promise.reject(error)
          }
          req.targetTagId = targetTag ? targetTagId : null
          req.targetTag = targetTag || null
          next()
          return Promise.resolve()
        })
        .catch(error => next(error))
    }
  }
}

function getRecordCount (includeDeleted = false) {
  return includeDeleted
    ? db.Tags.findAndCountAll({ paranoid: false })
    : db.Tags.findAndCountAll()
      .then(result => Promise.resolve(result.count))
      .catch(error => Promise.reject(error))
}

// route handler GET /tags
function getRecords (req, res, next) {
  return db.Tags
    .findAll(req.queryOptions)
    .then(data => {
      req.resJson = { data }
      next()
      return Promise.resolve
    })
    .catch(error => next(error))
}

// route handler POST /tags
function insertRecord (req, res, next) {
  return db.Tags
    .create(Object.assign({}, req.body, { id: req.nextAvailableId }))
    .then(() => db.Tags.findAll())
    .then(data => {
      req.resJson = { data }
      next()
      return Promise.resolve
    }).catch(error => next(error))
}

// find the next available id value in the tag table (integer)
function nextAvailableId (req, res, next) {
  let nextAvailableId = 0
  return db.Tags
    .findAll({ paranoid: false })
    .map(tags => tags.id)
    .then(tagIdList => {
      // loop through and find the next available unused id
      while (tagIdList.indexOf(nextAvailableId) !== -1) {
        nextAvailableId++
      }
      req.nextAvailableId = nextAvailableId
      next()
      return Promise.resolve()
    })
    .catch(error => next(error))
}

// patch record 'color' field value
function patchColor (req, res, next) {
  let targetColor = req.query.color
  if (colors.indexOf(targetColor) === -1) {
    res.status(400)
    let error = new Error(`${targetColor} is not a valid color`)
    return next(error)
  }
  return req.targetTag
    .update({ color: targetColor })
    .then(() => {
      next()
      return Promise.resolve()
    })
    .catch(error => next(error))
}

// reject request if target tag does not exist
function rejectInvalidTargetRequest (req, res, next) {
  if (!req.targetTag) {
    res.status(400)
    let error = new Error(`Target tag (id: ${parseInt(req.params.tagId)}) does not exist`)
    return next(error)
  }
}

// send target tag data in the server response 'data' property
function sendTargetTagData (req, res, next) {
  req.resJson = { data: req.targetTag }
  return next()
}
