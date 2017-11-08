const db = require('../../controllers/database/database')
const routerResponse = require('../../controllers/routerResponse')

module.exports = {
  query: query,
  queryWithProducts: queryWithProducts,
  queryById: queryById,
  queryByIdWithProducts: queryByIdWithProducts,
  queryByName: queryByName,
  queryByNameWithProducts: queryByNameWithProducts
}

function query () {
  return ['/', (req, res) => {
    let queryParameters = { order: ['displaySequence'] }
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
        error: error
      }))
  }]
}

function queryWithProducts () {
  return ['/products', (req, res) => {
    let queryParameters = {
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
        'displaySequence',
        [db.Products, 'code'],
        [db.Products, db.Tags, 'name'],
        [db.Products, db.Photos, 'primary', 'DESC']
      ]
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
        error: error
      }))
  }]
}

function queryById () {
  return ['/:id', (req, res) => {
    return db.Series
      .findById(req.params.id)
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
        error: error
      }))
  }]
}

function queryByIdWithProducts () {
  return ['/:id/products', (req, res) => {
    let queryParameters = {
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
        'displaySequence',
        [db.Products, 'code'],
        [db.Products, db.Tags, 'name'],
        [db.Products, db.Photos, 'primary', 'DESC']
      ]
    }
    return db.Series
      .findById(req.params.id, queryParameters)
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
        error: error
      }))
  }]
}

function queryByName () {
  return ['/name/:name', (req, res) => {
    let queryParameters = {
      where: {
        name: req.params.name
      }
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
        error: error
      }))
  }]
}

function queryByNameWithProducts () {
  return ['/name/:name/products', (req, res) => {
    let queryParameters = {
      where: {
        name: req.params.name
      },
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
        'displaySequence',
        [db.Products, 'code'],
        [db.Products, db.Tags, 'name'],
        [db.Products, db.Photos, 'primary', 'DESC']
      ]
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
        error: error
      }))
  }]
}
