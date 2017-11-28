const db = require('../../controllers/database')

const validateJwt = require('../../middlewares/validateJwt')

module.exports = [
  validateJwt({ admin: true }), // validate against token for admin privilege
  async (req, res, next) => {
    let seriesData = {
      name: req.body.name,
      active: true
    }
    // find the parentSeries
    let parent = await db.Series
      .findById(req.body.parentSeriesId.toUpperCase() || null)
      .catch(error => next(error))
    // set properties according to status of found(or missing) parent
    if (parent) {
      seriesData.menuLevel = parent.menuLevel + 1
      seriesData.parentSeriesId = parent.id
    } else {
      seriesData.menuLevel = 0
      seriesData.parentSeriesId = null
    }
    // find siblings of the new record
    let searchOptions = seriesData.menuLevel === 0
      ? { where: { menuLevel: 0 } }
      : { where: { parentSeriesId: parent.id } }
    let siblings = await db.Series.findAll(searchOptions).catch(error => next(error))
    // set order value (place at the end of the order)
    if (siblings) {
      seriesData.order = siblings.length
    } else {
      seriesData.order = 0
    }
    return db.Series
      .create(seriesData)
      .then((data) => {
        req.resJson = { data }
        return next()
      })
      .catch(error => next(error))
  }]
