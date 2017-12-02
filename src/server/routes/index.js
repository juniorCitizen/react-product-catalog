const express = require('express')

const eVars = require('../config/eVars')
const routerReponse = require('../middlewares/responseHandlers')

module.exports = express.Router()
  .get('*',
    (req, res, next) => {
      req.resTemplate = {
        view: 'index',
        data: {
          title: eVars.SYS_REF,
<<<<<<< HEAD
          faviconSource: `${eVars.APP_ROUTE}/dist/public/favicon.ico`,
          scriptSource: !eVars.devMode
            ? `${eVars.APP_ROUTE}/dist/public/app.min.js`
            : `${eVars.APP_ROUTE}/dist/public/app.js`,
          vendorSource: !eVars.devMode
            ? `${eVars.APP_ROUTE}/dist/public/vendor.min.js`
            : `${eVars.APP_ROUTE}/dist/public/vendor.js`,
          styleSource: !eVars.devMode
            ? `${eVars.APP_ROUTE}/dist/public/app-bluma.min.css`
            : `${eVars.APP_ROUTE}/dist/public/app-bluma.css`,
=======
          faviconSource: `${eVars.APP_ROUTE}/favicon.ico`,
          scriptSource: !eVars.devMode
            ? `${eVars.APP_ROUTE}/app.min.js`
            : `${eVars.APP_ROUTE}/app.js`,
          vendorSource: !eVars.devMode
            ? `${eVars.APP_ROUTE}/vendor.min.js`
            : `${eVars.APP_ROUTE}/vendor.js`,
          styleSource: !eVars.devMode
            ? `${eVars.APP_ROUTE}/app.min.css`
            : `${eVars.APP_ROUTE}/app-bluma.css`,
>>>>>>> a96c8dce52180fc2a72bce43a0b538f75f3a373c
          appUrl: eVars.APP_ROUTE
        }
      }
      return next()
    },
    routerReponse.template
  )
