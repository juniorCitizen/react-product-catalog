const db = require('../../controllers/database')

const validateJwt = require('../../middlewares/validateJwt')

module.exports = [
  validateJwt({ user: true }),
  (req, res, next) => {
    return db.PurchaseOrders
      .findById(req.params.purchaseOrderId.toUpperCase(), {
        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
        include: [{
          model: db.Contacts,
          attributes: { exclude: ['hashedPassword', 'salt', 'admin'] },
          include: [{ model: db.Companies }]
        }, {
          model: db.OrderDetails,
          attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
          include: [{ model: db.Products }]
        }]
      })
      .then(data => {
        req.resJson = { data }
        next()
        return Promise.resolve()
      })
      .catch(error => next(error))
  }
]
