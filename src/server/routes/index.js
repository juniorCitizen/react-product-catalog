const express = require('express')
const path = require('path')

require('dotenv').config()

const accessPath = process.env.NODE_ENV === 'development'
  ? path.resolve('./src/server')
  : path.resolve('./dist')

const eVars = require(path.join(accessPath, 'config/eVars'))
const routerResponse = require(path.join(accessPath, 'controllers/routerResponse'))

const router = express.Router()

router.get('/', (req, res) => {
  return routerResponse.template({
    res: res,
    statusCode: 200,
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
  })
})

module.exports = router
