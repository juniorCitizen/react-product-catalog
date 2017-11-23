const express = require('express')

const eVars = require('../config/eVars')
const routerReponse = require('../middlewares/responseHandlers')

module.exports = express.Router()
  .get('/',
    (req, res, next) => {
      req.resTemplate = {
        view: 'index',
        data: {
          title: eVars.SYS_REF,
          faviconSource: `${eVars.APP_ROUTE}/images/favicon.ico`,
          scriptSource: !eVars.devMode
            ? `${eVars.APP_ROUTE}/app.min.js`
            : `${eVars.APP_ROUTE}/app.js`,
          styleSource: !eVars.devMode
            ? `${eVars.APP_ROUTE}/app.min.css`
            : `${eVars.APP_ROUTE}/app.css`,
          appUrl: eVars.APP_ROUTE
        }
      }
      return next()
    },
    routerReponse.template
  )
