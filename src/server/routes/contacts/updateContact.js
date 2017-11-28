// const db = require('../../controllers/database')

// const botPrevention = require('../../middlewares/botPrevention')
// const validateJwt = require('../../middlewares/validateJwt')
// const validatePasswordFormat = require('../../middlewares/validatePasswordFormat')

// const editableByUsers = ['email', 'name', 'mobile']
// const editableByAdmins = ['admin', 'active']

module.exports = [
  (req, res, next) => {
    // next()
    return res.status(200).end()
  }
]
