const db = require('../../controllers/database')
const logging = require('../../controllers/logging')

module.exports = {
  getChildSeries
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
