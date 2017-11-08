const path = require('path')

require('dotenv').config()

const accessPath = process.env.NODE_ENV === 'development'
  ? path.resolve('./src/server')
  : path.resolve('./dist')

const db = require(path.join(accessPath, 'controllers/database'))
const routerResponse = require(path.join(accessPath, 'controllers/routerResponse'))

module.exports = {
  complete: complete,
  completeWithProducts: completeWithProducts,
  byId: byId,
  byIdWithProducts: byIdWithProducts,
  byName: byName,
  byNameWithProducts: byNameWithProducts
}

function complete () {
  return ['/', (req, res) => {
    let queryParameters = { order: ['order'] }
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

function completeWithProducts () {
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
        'order',
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

function byId () {
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

function byIdWithProducts () {
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
        'order',
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

function byName () {
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

function byNameWithProducts () {
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
        'order',
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
