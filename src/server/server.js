// load npm packages
// const bodyParser = require('body-parser')
const express = require('express')
const exphbs = require('express-handlebars')
const path = require('path')
const Promise = require('bluebird')

// load custom modules
// const db = require('./controllers/database/database')
// const emailSystem = require('./controllers/emails/emails')
// const proxyRegistration = require('./controllers/proxyRegistration')
const eVars = require('./config/eVars')
const logging = require('./controllers/logging')

// instantiating Express Framework
logging.console('初始化 Express 框架...')
const app = express()

// setup Handlebars template engine
logging.console('Express Handlebars 模板引擎設定...')
app.engine('.hbs', exphbs({
  defaultLayout: 'main',
  extname: '.hbs',
  layoutsDir: path.join(__dirname, 'views/layouts'),
  partialsDir: path.join(__dirname, 'views/partials')
}))
app.set('view engine', '.hbs')
app.set('views', path.join(__dirname, 'views'))
app.set('layouts', path.join(__dirname, 'views/layouts'))
app.set('partials', path.join(__dirname, 'views/partials'))

// global middlewares
// if (eVars.NODE_ENV !== 'production') { app.use(require('morgan')('dev')) } // for debugging
// app.use(bodyParser.urlencoded({ extended: true })) // application/x-www-form-urlencoded
// app.use(bodyParser.json()) // application/json
// console.log(`loading global middlewares...`)

// setup routing
// console.log('setup routers...')
// const clientAccessRouter = express.Router()
// app.use('/productCatalog', clientAccessRouter)
// const apiAccessRouter = express.Router()
// app.use('/productCatalog/api', apiAccessRouter)

// declaration of routing and endpoint handlers
// console.log('setup end-point handlers...')

// serve index.html from hbs template engine
// clientAccessRouter.use('/', require(path.join(__dirname, 'routes/clientAccess')))

// set up api routes
// apiAccessRouter.use('/products', require(path.join(__dirname, 'routes/products/products')))
// apiAccessRouter.use('/photos', require(path.join(__dirname, 'routes/photos/photos')))
// apiAccessRouter.use('/countries', require(path.join(__dirname, 'routes/countries/countries')))
// apiAccessRouter.use('/registrations', require(path.join(__dirname, 'routes/registrations/registrations')))
// apiAccessRouter.use('/users', require(path.join(__dirname, 'routes/users/users')))
// apiAccessRouter.use('/token', require(path.join(__dirname, 'routes/token/token')))

// serve index.html from hbs template engin for any mismatched route requests
// app.use('*', require(path.join(__dirname, 'routes/clientAccess')))
// post-routing global middleware
// app.use(require('./middleware/404Handler')) // catch 404 and forward to error handler

// initializing system components
logging.console('系統模組初始化...')
let preStartupInitSequence = [
  '啟動前模組 1 初始化...',
  '啟動前模組 2 初始化...'
]
// systemInitSequence.push(db.initialize()) // initialize system database
// systemInitSequence.push(emailSystem.initialize()) // initialize email system
logging.console('進行伺服器啟動前置作業...')
Promise.each(
  preStartupInitSequence,
  (preStartupMessage = '') => {
    logging.console(preStartupMessage)
  })
  .then(() => {
    logging.console('啟動 Node Express 伺服器...')
    return app.listen(eVars.PORT, (error) => {
      if (error) {
        logging.error(error, `${eVars.SYS_REF} 伺服器無法正確啟動...`)
        throw error
      }
      logging.console(`${eVars.SYS_REF} 伺服器正常啟動... (${eVars.HOST})`)
      let postStartupInitSequence = [
        '啟動後模組 1 初始化...',
        '啟動後模組 2 初始化...'
      ]
      return Promise.each(
        postStartupInitSequence,
        (postStartupMessage) => {
          logging.console(postStartupMessage)
        })
    })
  })
  .catch((error) => {
    logging.error(error)
    throw error
  })

process.on('uncaughtException', (error) => {
  logging.error(error, '發生未預期 exception !!!')
})
