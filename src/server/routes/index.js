const express = require('express')

const eVars = require('../config/eVars')
const routerReponse = require('../middlewares/responseHandler')

module.exports = express.Router()
  .get('/',
    (req, res, next) => {
      req.resTemplate = {
        view: 'index',
        data: {
          title: eVars.SYS_REF,
          faviconSource: `${eVars.APP_ROUTE}/images/favicon.ico`,
          scriptSource: !eVars.devMode
            ? `${eVars.APP_ROUTE}/javascripts/app.min.js`
            : `${eVars.APP_ROUTE}/javascripts/app.js`,
          styleSource: !eVars.devMode
            ? `${eVars.APP_ROUTE}/stylesheets/app.min.css`
            : `${eVars.APP_ROUTE}/stylesheets/app.css`
        }
      }
      return next()
    },
    routerReponse.template
  )
