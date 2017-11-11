const db = require('../../controllers/database')

module.exports = {
  details: details,
  simple: simple
}

function details () {
  return {
    include: [{
      model: db.Tags
    }, {
      model: db.Photos,
      attributes: { exclude: ['data'] }
    }],
    order: [
      'code',
      [db.Tags, 'name'],
      [db.Photos, 'primary', 'DESC']
    ]
  }
}

function simple () {
  return { order: ['code'] }
}
