const db = require('../../controllers/database')
const routerResponse = require('../../controllers/routerResponse')

module.exports = {
  complete: complete
  // byId: byId,
  // byIdWithProducts: byIdWithProducts,
  // byName: byName,
  // byNameWithProducts: byNameWithProducts
}

function complete () {
  return ['/', (req, res) => {
    let queryParameters = { order: ['code'] }
    if (req.query.hasOwnProperty('details')) {
      queryParameters.order.push([db.Tags, 'name'])
      queryParameters.order.push([db.Photos, 'primary', 'DESC'])
      Object.assign(queryParameters, {
        include: [{
          model: db.Tags
        }, {
          model: db.Photos,
          attributes: { exclude: ['data'] }
        }]
      })
    }
    return db.Products
      .findAll(queryParameters)
      .then((productData) => {
        return routerResponse.json({
          req: req,
          res: res,
          statusCode: 200,
          data: productData
        })
      })
      .catch(error => routerResponse.json({
        req: req,
        res: res,
        statusCode: 500,
        error: error,
        message: '產品總表查詢失敗'
      }))
  }]
}