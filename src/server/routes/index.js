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
          faviconSource: `${eVars.APP_ROUTE}/dist/public/favicon.ico`,
          scriptSource: !eVars.devMode
            ? `${eVars.APP_ROUTE}/dist/public/app.min.js`
            : `${eVars.APP_ROUTE}/dist/public/app.js`,
          vendorSource: !eVars.devMode
            ? `${eVars.APP_ROUTE}/dist/public/vendor.min.js`
            : `${eVars.APP_ROUTE}/dist/public/vendor.js`,
          styleSource: !eVars.devMode
            ? `${eVars.APP_ROUTE}/app-bluma.min.css`
            : `${eVars.APP_ROUTE}/app-bluma.css`,
          appUrl: eVars.APP_ROUTE
        }
      }
      return next()
    },
    routerReponse.template
  )
