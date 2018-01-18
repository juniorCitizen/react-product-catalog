const db = require('../../controllers/database')
const logging = require('../../controllers/logging')

module.exports = {
  getChildSeries,
  getSeriesWithProducts,
  getSeriesMenu
}

function getSeriesWithProducts (seriesId = null) {
  if (!seriesId) {
    let error = new Error('seriesId must be specified')
    error.status = 400
    return Promise.reject(error)
  }
  return db.Series
    .findById(seriesId, {
      include: [{
        model: db.Products,
        include: [
          { model: db.Tags },
          { model: db.Photos }
        ]
      }],
      order: [
        [db.Products, 'code'],
        [db.Products, db.Tags, 'name'],
        [db.Products, db.Photos, 'primary', 'desc']
      ]
    })
    .then(data => Promise.resolve(data))
    .catch(error => {
      logging.error(error, '/models/queries/series.getSeries() errored')
      return Promise.reject(error)
    })
}

// find children series by seriesId
// 'null' seriesId meaning looking under root series
function getChildSeries (seriesId = null) {
  let query = seriesId
    ? db.Series.findById(seriesId, {
      include: { model: db.Series, as: 'childSeries' },
      order: [[{ model: db.Series, as: 'childSeries' }, 'displaySequence']]
    })
    : db.Series.findAll({
      where: { menuLevel: 0 },
      order: [['displaySequence']]
    })
  return query
    .then(data => Promise.resolve(seriesId ? data.childSeries : data))
    .catch(error => {
      logging.error(error, '/models/queries/series.getChildSeries() errored')
      return Promise.reject(error)
    })
}

// get a bare series menu structure
function getSeriesMenu () {
  let queryOptions = {
    where: { menuLevel: 0 },
    include: [{}],
    order: ['displaySequence']
  }
  return getDepth()
    .then(menuDepth => {
      generateIncludeOptions(menuDepth, queryOptions.include[0])
      generateOrderOptions(menuDepth, queryOptions.order)
      return db.Series
        .findAll(queryOptions)
        .then(data => Promise.resolve(data))
        .catch(error => {
          logging.error(error, '/models/queries/series.getSeriesMenu() errored')
          return Promise.reject(error)
        })
    })
    .catch(error => {
      logging.error(error, '/models/queries/series.getSeriesMenu() errored')
      return Promise.reject(error)
    })
}

// recursive function to generate include options for series menu query
function generateIncludeOptions (depth, baseIncludeOptions, counter = 0) {
  Object.assign(baseIncludeOptions, { model: db.Series, as: 'childSeries' })
  if (counter < (depth - 1)) {
    Object.assign(baseIncludeOptions, { include: [{}] })
    generateIncludeOptions(depth, baseIncludeOptions.include[0], counter + 1)
  }
}

// recursive function to generate order options for series menu query
function generateOrderOptions (depth, baseOrderOptions, counter = 0) {
  baseOrderOptions.push([])
  for (let x = counter; x >= 0; x--) {
    baseOrderOptions[counter + 1].push({ model: db.Series, as: 'childSeries' })
  }
  baseOrderOptions[counter + 1].push('displaySequence')
  if (counter < (depth - 1)) {
    generateOrderOptions(depth, baseOrderOptions, counter + 1)
  }
}

// query the maximum value in the 'menuLevel' field of the series table
function getDepth () {
  return db.Series
    .max('menuLevel')
    .then(data => Promise.resolve(data))
    .catch(error => {
      logging.error(error, '/models/queries/series.getDepth() errored')
      return Promise.reject(error)
    })
}
