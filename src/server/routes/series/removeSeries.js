const Promise = require('bluebird')

const db = require('../../controllers/database/database')
const routerResponse = require('../../controllers/routerResponse')

const validateJwt = require('../../middlewares/validateJwt')

module.exports = {
  byId: deleteById,
  byName: deleteByName
}

function deleteById () {
  return ['/id/:id', validateJwt, (req, res) => {
    return db.Series
      .destroy({ where: { id: req.params.id } })
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
        error: error,
        message: `產品系列記錄 id = ${req.params.id} 刪除失敗`
      }))
  }]
}

function deleteByName () {
  return ['/name/:name', validateJwt, (req, res) => {
    return db.Series
      .destroy({ where: { name: req.params.name } })
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
        error: error,
        message: `產品系列記錄 id = ${req.params.name} 刪除失敗`
      }))
  }]
}
