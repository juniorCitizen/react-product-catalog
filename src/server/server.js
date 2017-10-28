// load npm packages
import bodyParser from 'body-parser'
import cors from 'cors'
import express from 'express'
import exphbs from 'express-handlebars'
import path from 'path'
import Promise from 'bluebird'

// load custom modules
import db from './controllers/database/database'
import emailSystem from './controllers/emails/emails'
import proxyRegistration from './controllers/proxyRegistration'
import eVars from './config/environment'

// instantiating Express Framework
console.log('instantiating Express Framework...')
const app = express()

// setup Handlebars template engine
console.log('setup Handlebars templating engine...')
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
console.log('loading global middlewares...')
app.use(cors()) // allowing cross origin requests
if (eVars.NODE_ENV !== 'production') { app.use(require('morgan')('dev')) } // for debugging
app.use(bodyParser.urlencoded({ extended: true })) // application/x-www-form-urlencoded
app.use(bodyParser.json()) // application/json

// setup routing
console.log('setup routers...')
const clientAccessRouter = express.Router()
app.use('/productCatalog', clientAccessRouter)
const apiAccessRouter = express.Router()
app.use('/productCatalog/api', apiAccessRouter)

// declaration of routing and endpoint handlers
console.log('setup end-point handlers...')

// serve index.html from hbs template engine
clientAccessRouter.use('/', require(path.join(__dirname, 'routes/clientAccess')))

// set up api routes
apiAccessRouter.use('/products', require(path.join(__dirname, 'routes/products/products')))
apiAccessRouter.use('/photos', require(path.join(__dirname, 'routes/photos/photos')))
apiAccessRouter.use('/countries', require(path.join(__dirname, 'routes/countries/countries')))
apiAccessRouter.use('/registrations', require(path.join(__dirname, 'routes/registrations/registrations')))
apiAccessRouter.use('/users', require(path.join(__dirname, 'routes/users/users')))
apiAccessRouter.use('/token', require(path.join(__dirname, 'routes/token/token')))

// serve index.html from hbs template engin for any mismatched route requests
app.use('*', require(path.join(__dirname, 'routes/clientAccess')))

// initializing system components
console.log('initializing system components...')
let systemInitSequence = []
systemInitSequence.push(db.initialize()) // initialize system database
systemInitSequence.push(emailSystem.initialize()) // initialize email system
Promise
    .each(systemInitSequence, () => {
        return Promise.resolve()
    })
    .then(() => {
        // start node express server if successful
        console.log('spin up Node Express web server...')
        return app.listen(eVars.PORT, (error) => {
            if (error) {
                console.log(`${eVars.SYS_REF} server could not be started...`)
                return Promise.reject(error)
            } else {
                proxyRegistration
                    .then(() => {
                        console.log(`${eVars.SYS_REF} server activated (${eVars.HOST}:${eVars.PORT})`)
                        return Promise.resolve()
                    })
                    .catch((error) => {
                        return Promise.reject(error)
                    })
            }
        })
    })
    .catch((error) => {
        console.log(error.name)
        console.log(error.message)
        console.log(error.stack)
        throw error
    })
