const db = require('../../controllers/database')
const routerResponse = require('../../controllers/routerResponse')

module.exports = (req, res) => {
  return db.OfficeLocations
    .findAll({
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'deletedAt']
      },
      include: [{
        model: db.Countries,
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'deletedAt']
        }
      }, {
        model: db.Users,
        attributes: {
          exclude: [
            'loginId',
            'password',
            'salt',
            'createdAt',
            'updatedAt',
            'deletedAt'
          ]
        }
      }]
    })
    .then((data) => {
      return routerResponse.json({
        pendingResponse: res,
        originalRequest: req,
        statusCode: 200,
        success: true,
        data: data
      })
    })
    .catch((error) => {
      return routerResponse.json({
        pendingResponse: res,
        originalRequest: req,
        statusCode: 500,
        success: false,
        error: error.name,
        message: error.message,
        data: error.stack
      })
    })
}
