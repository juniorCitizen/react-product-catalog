// load npm packages
const bodyParser = require('body-parser')
const express = require('express')
const exphbs = require('express-handlebars')
const path = require('path')
const Promise = require('bluebird')

// load custom modules
const db = require('./controllers/database')
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

// pre-routing global middlewares
logging.console('載入 pre-routing 全域 middlewares...')
if (eVars.devMode) { app.use(require('morgan')('dev')) } // request logger
// parse request with application/x-www-form-urlencoded body data
app.use(bodyParser.urlencoded({ extended: true, limit: '5mb' })) // for request with large body data
// parse request with application/json body data
app.use(bodyParser.json({ limit: '5mb' })) // for request with large body data

// setup routing
logging.console('宣告系統 routing 定義...')
const ROUTERS = {
  api: {
    router: express.Router(),
    endpoint: `/${eVars.SYS_REF}/api`
  },
  client: {
    router: express.Router(),
    endpoint: `/${eVars.SYS_REF}`
  },
  assets: {
    router: express.Router(),
    endpoint: `/${eVars.SYS_REF}`,
    path: (() => {
      return eVars.devMode
        ? path.resolve('./src/client/assets')
        : path.resolve('./dist/assets')
    })()
  }
}
app.use(ROUTERS.api.endpoint, ROUTERS.api.router)
app.use(ROUTERS.client.endpoint, ROUTERS.client.router)
app.use(ROUTERS.assets.endpoint, ROUTERS.assets.router)

// declaration of routing and endpoint handlers
logging.console('宣告 end-point 處理程序...')

// setup public assets endpoint
ROUTERS.assets.router.use(express.static(ROUTERS.assets.path))
ROUTERS.assets.router.use('/carousels', require('./routes/carousels'))
logging.console(`public assets 實體檔案路徑... ${ROUTERS.assets.path}`)
// setup SPA index.html endpoint
ROUTERS.client.router.use('/', require('./routes/index'))
logging.console(`index.html 端點... ${eVars.HOST}${ROUTERS.client.endpoint}`)
// set up api endpoints
ROUTERS.api.router.use('/products', require('./routes/products'))
ROUTERS.api.router.use('/series', require('./routes/series'))
ROUTERS.api.router.use('/tokens', require('./routes/tokens'))
ROUTERS.api.router.use('/photos', require('./routes/photos'))
// apiAccessRouter.use('/countries', require('./routes/countries/countries'))
// apiAccessRouter.use('/registrations', require('./routes/registrations/registrations'))
// apiAccessRouter.use('/users', require('./routes/users/users'))

// post-routing global middleware
logging.console('載入 post-routing 全域 middlewares....')
// catch 404's and redirect to index.html template route
app.use(require('./middlewares/404Handler'))

// initializing system components
logging.console('系統模組初始化...')
// modules that needs to be initialized before hand goes here
let preStartupInitSequence = [
  db.initialize(),
  // emailSystem.initialize(), // initialize email system
  '啟動前模組 2 初始化...' // dummy stub
]
logging.console('伺服器啟動前置作業...')
logging.console('前置模組初始化...')
Promise.each( // runs the pre server start init scripts
  preStartupInitSequence,
  (preStartupMessage = '') => {
    logging.console(preStartupMessage)
  })
  .then(() => {
    logging.console(`啟動 ${eVars.SYS_REF} 伺服器...`)
    return app.listen(eVars.PORT, (error) => {
      if (error) {
        logging.error(error, `${eVars.SYS_REF} 伺服器無法正確啟動...`)
        throw error
      }
      logging.console(`${eVars.SYS_REF} 伺服器正常啟動... (${eVars.HOST})`)
      // modules that can be initialized afterwards goes here
      let postStartupInitSequence = [
        '啟動後模組 1 初始化...', // dummy stub
        '啟動後模組 2 初始化...' // dummy stub
      ]
      logging.console('後置模組初始化...')
      return Promise.each( // runs the post server start init scripts
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
