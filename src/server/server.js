// ///////////
// npm 模組加載
// ///////////
const bodyParser = require('body-parser')
const cors = require('cors')
const express = require('express')
const exphbs = require('express-handlebars')
const path = require('path')
const Promise = require('bluebird')

// /////////////
// 客製化模組加載
// /////////////
const db = require('./controllers/database')
// const emailSystem = require('./controllers/emails/emails')
const eVars = require('./config/eVars')
const logging = require('./controllers/logging')

// ///////////////////////////////////////////////////////////
// 系統部件初始化程序 - 伺服器以及路由配置啟動之前必須啟動的服務原件
// ///////////////////////////////////////////////////////////
logging.console('系統模組初始化...')
// 服務原件先行加載
let preStartupInitSequence = [
  db.initialize(), // 資料庫系統
  // emailSystem.initialize(), // email 發送系統
  '其他伺服器啟動前置模組 1 初始化...', // dummy stub
  '其他伺服器啟動前置模組 2 初始化...' // dummy stub
]
logging.console('伺服器啟動前置作業...')
logging.console('前置模組初始化...')
Promise.each( // 依序執行服務原件的啟動程序
  preStartupInitSequence,
  (preStartupMessage = '') => {
    logging.console(preStartupMessage)
  })
  .then(() => {
    // ///////////////////
    // Express 框架啟動配置
    // ///////////////////

    // ////////////// Express Framework /////////////////////////////////////
    logging.console('初始化 Express 框架...')
    const app = express()

    // ////////////// Handlebars Template Engine ////////////////////////////
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

    // ////////////// Pre-Routing Global Middlewares ////////////////////////
    logging.console('載入 pre-routing 全域 middlewares...')
    if (eVars.devMode) { app.use(require('morgan')('dev')) } // request logger
    app.use(cors()) // enable CORS for all origins
    // parse request with application/x-www-form-urlencoded body data
    app.use(bodyParser.urlencoded({ extended: true, limit: '5mb' })) // for request with large body data
    // parse request with application/json body data
    app.use(bodyParser.json({ limit: '5mb' })) // for request with large body data

    // ///////////// Routing Setup //////////////////////////////////////////
    logging.console('路由器端點定義...')
    const ROUTERS = {
      api: {
        router: express.Router(),
        endpoint: `/${eVars.SYS_REF}/api`
      },
      assets: {
        router: express.Router(),
        endpoint: `/${eVars.SYS_REF}`,
        path: (() => {
          return eVars.devMode
            ? path.resolve('./src/client/assets')
            : path.resolve('./dist/assets')
        })()
      },
      client: {
        router: express.Router(),
        endpoint: `/${eVars.SYS_REF}`
      }
    }

    // declaration of routing and endpoint handlers
    logging.console('路由端點宣告...')
    // set up api endpoints
    app.use(ROUTERS.api.endpoint, ROUTERS.api.router)
    ROUTERS.api.router.use('/', require('./routes/apiRouteHandlers'))
    logging.console('API 端點宣告完成')
    // setup public assets endpoint
    app.use(ROUTERS.assets.endpoint, ROUTERS.assets.router)
    ROUTERS.assets.router.use(express.static(ROUTERS.assets.path))
    logging.console(`public assets 實體檔案路徑宣告完成... ${ROUTERS.assets.path}`)
    // setup SPA index.html endpoint
    app.use(ROUTERS.client.endpoint, ROUTERS.client.router)
    ROUTERS.client.router.use('/', require('./routes/index'))
    logging.console(`index.html 端點宣告完成... ${eVars.HOST}${ROUTERS.client.endpoint}`)

    // ////////////// Post-Routing Global Middlewares ////////////////////////
    logging.console('載入 post-routing 全域 middlewares....')
    app.use((req, res, next) => {
      logging.warning(`客戶端要求不存在的頁面: ${req.method.toLowerCase()} ${eVars.APP_ROUTE}${req.path}`)
      res.status(404)
      return res.redirect(`${eVars.APP_ROUTE}`)
    })

    // ///////////////// Web Server ///////////////////////////////////////////
    logging.console(`啟動 ${eVars.SYS_REF} 伺服器...`)
    return app.listen(eVars.PORT, (error) => {
      if (error) {
        logging.error(error, `${eVars.SYS_REF} 伺服器無法正確啟動...`)
        throw error
      }
      logging.console(`${eVars.SYS_REF} 伺服器正常啟動... (${eVars.HOST})`)

      // ///////////////////////////////////////////////////////////
      // 系統部件初始化程序 - 伺服器以及路由配置啟動之後才需啟動的服務原件
      // ///////////////////////////////////////////////////////////
      // modules that can be initialized afterwards goes here
      let postStartupInitSequence = [
        '伺服器啟動後置模組 1 初始化...', // dummy stub
        '伺服器啟動後置模組 2 初始化...' // dummy stub
      ]
      logging.console('後置模組初始化...')
      return Promise
        .each( // runs the post server start init scripts
          postStartupInitSequence,
          (postStartupMessage) => {
            logging.console(postStartupMessage)
          })
        .catch((error) => {
          logging.error(error)
          return Promise.reject(error)
        })
    })
  })
  .catch((error) => {
    logging.error(error)
    throw error
  })

// //////////////////////
// // 錯誤/例外的捕捉與處理
// //////////////////////
process.on('unhandledRejection', (error, promise) => {
  logging.error(error, '發現未處理的 Promise Rejection')
  logging.warning(promise)
})

process.on('uncaughtException', (error) => {
  logging.error(error, '發生未預期 exception !!!')
})
