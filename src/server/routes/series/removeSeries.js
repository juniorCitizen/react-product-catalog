const Promise = require('bluebird')

const db = require('../../controllers/database/database')
const routerResponse = require('../../controllers/routerResponse')

module.exports = (req, res) => {
  // set query WHERE parameters
  let queryParameter = req.query.id !== undefined
    ? { where: { id: req.query.id } }
    : { where: { name: req.query.name } }
  return db.Series
    // find one record that matches the query parameter
    .findOne(queryParameter)
    .then((seriesItem) => {
      return (seriesItem === null)
        ? Promise.resolve()
        : seriesItem.destroy()
    })
    .then((result) => {
      routerResponse.json({
        req: req,
        res: res,
        statusCode: 200,
        data: result
      })
      return Promise.resolve()
    })
    .catch(error => routerResponse.json({
      req: req,
      res: res,
      statusCode: 500,
      error: error
    }))
}
