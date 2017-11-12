const db = require('../../controllers/database')
const routerResponse = require('../../controllers/routerResponse')

module.exports = {
  complete: complete,
  byId: byId,
  byName: byName
}

function complete () {
  return ['/', (req, res) => {
    let queryParameters = { order: ['order'] }
    if (req.query.hasOwnProperty('details')) {
      Object.assign(queryParameters, additionalDetails())
      queryParameters.order.splice(0, 0, 'order')
    }
    return db.Series
      .findAll(queryParameters)
      .then((seriesData) => {
        return routerResponse.json({
          req: req,
          res: res,
          statusCode: 200,
          data: seriesData
        })
      })
      .catch(error => routerResponse.json({
        req: req,
        res: res,
        statusCode: 500,
        error: error,
        message: '產品類別總表查詢失敗'
      }))
  }]
}

function byId () {
  return ['/id/:id', (req, res) => {
    let queryParameters = [req.params.id]
    if (req.query.hasOwnProperty('details')) {
      queryParameters.push(
        Object.assign({}, additionalDetails())
      )
    }
    return db.Series
      .findById(...queryParameters)
      .then((targetRecord) => {
        return routerResponse.json({
          req: req,
          res: res,
          statusCode: 200,
          data: targetRecord
        })
      })
      .catch(error => routerResponse.json({
        req: req,
        res: res,
        statusCode: 500,
        error: error,
        message: '產品類別以 id 查詢失敗'
      }))
  }]
}

function byName () {
  return ['/name/:name', (req, res) => {
    let queryParameters = { where: { name: req.params.name } }
    if (req.query.hasOwnProperty('details')) {
      Object.assign(queryParameters, additionalDetails())
    }
    return db.Series
      .findOne(queryParameters)
      .then((targetRecord) => {
        return routerResponse.json({
          req: req,
          res: res,
          statusCode: 200,
          data: targetRecord
        })
      })
      .catch(error => routerResponse.json({
        req: req,
        res: res,
        statusCode: 500,
        error: error,
        message: '產品類別以名稱查詢失敗'
      }))
  }]
}

function additionalDetails () {
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
      [db.Products, 'code'],
      [db.Products, db.Tags, 'name'],
      [db.Products, db.Photos, 'primary', 'DESC']
    ]
  }
}
