const db = require('../../controllers/database')

module.exports = [
  (req, res, next) => {
    return db.Series
      .max('menuLevel')
      .then(maxMenuLevel => {
        // set base option
        let includeOptions = {
          include: [
            { model: db.Products, attributes: { exclude: ['name', 'specification', 'description'] } },
            { model: db.Series, as: 'childSeries' }
          ]
        }
        // run recursive function to construct child menu query options
        setupIncludeOptions(maxMenuLevel, includeOptions)
        // construct order query options
        let orderOptions = ['order', [{ model: db.Products }, 'code']]
        for (let counter = 0; counter < maxMenuLevel; counter++) {
          orderOptions.push(['order'])
          orderOptions.push([{ model: db.Products }, 'code'])
          for (let counter2 = 0; counter2 <= counter; counter2++) {
            orderOptions[counter + 1].splice(0, 0, { model: db.Series, as: 'childSeries' })
          }
        }
        return Promise.resolve(Object.assign(
          {},
          includeOptions,
          { where: { menuLevel: 0 } },
          { order: orderOptions })
        )
      })
      // run query to get the series menu
      .then(queryOptions => db.Series.findAll(queryOptions))
      .then(data => {
        req.resJson = { data }
        next()
        return Promise.resolve()
      })
      .catch(error => next(error))
  }
]

// recursive function to construct nested includeOptions
function setupIncludeOptions (levelCount, parent, counter = 0) {
  if (counter < (levelCount)) {
    Object.assign(parent['include'][1], {
      include: [
        { model: db.Products, attributes: { exclude: ['name', 'specification', 'description'] } },
        { model: db.Series, as: 'childSeries' }
      ]
    })
    setupIncludeOptions(levelCount, parent['include'][1], counter + 1)
  }
}
