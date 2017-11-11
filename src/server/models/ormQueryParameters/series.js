const db = require('../../controllers/database')

module.exports = {
  details: details,
  simple: simple
}

function details () {
  return {
    include: [{
      model: db.Products,
      include: [{ model: db.Tags }, {
        model: db.Photos,
        attributes: { exclude: ['data'] }
      }]
    }, {
      model: db.Photos,
      attributes: { exclude: ['data'] }
    }],
    order: [
      'order',
      [db.Products, 'code'],
      [db.Products, db.Tags, 'name'],
      [db.Products, db.Photos, 'primary', 'DESC']
    ]
  }
}

function simple () {
  return { order: ['order'] }
}
