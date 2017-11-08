const path = require('path')

require('dotenv').config()

const accessPath = process.env.NODE_ENV === 'development'
  ? path.resolve('./src/server')
  : path.resolve('./dist')

const db = require(path.join(accessPath, 'controllers/database'))
const routerResponse = require(path.join(accessPath, 'controllers/routerResponse'))

const validateJwt = require(path.join(accessPath, 'middlewares/validateJwt'))

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
