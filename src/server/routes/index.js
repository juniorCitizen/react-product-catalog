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
          faviconSource: `${eVars.APP_ROUTE}/assets/favicon.ico`,
          scriptSource: !eVars.devMode
            ? `${eVars.APP_ROUTE}/assets/app.min.js`
            : `${eVars.APP_ROUTE}/assets/app.js`,
          vendorSource: !eVars.devMode
            ? `${eVars.APP_ROUTE}/assets/vendor.min.js`
            : `${eVars.APP_ROUTE}/assets/vendor.js`,
          styleSource: !eVars.devMode
            ? `${eVars.APP_ROUTE}/assets/app-bluma.min.css`
            : `${eVars.APP_ROUTE}/assets/app-bluma.css`,
          reloadSource: !eVars.devMode
            ? `${eVars.APP_ROUTE}/reload/reload.js`
            : `${eVars.APP_ROUTE}/reload/reload.js`,
          appUrl: eVars.APP_ROUTE
        }
      }
      return next()
    },
    routerReponse.template
  )
