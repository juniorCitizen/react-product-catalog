require('dotenv').config()

const eVars = process.env

const devMode = eVars.NODE_ENV === 'development'
// const prodHost = eVars.PROD_HOST
// const remoteDevHost = eVars.REMOTE_DEV_HOST
// const sysRef = eVars.SYS_REF

module.exports = (() => {
  return {
    devMode: devMode,
    NODE_ENV: eVars.NODE_ENV,
    SYS_REF: eVars.SYS_REF,
    PROTOCOL: eVars.PROTOCOL,
    DOMAIN: domain(),
    PORT: normalizePort(eVars.PORT),
    HOST: host(),
    APP_ROUTE: `${host()}/${eVars.SYS_REF}`,
    TIMEZONE: eVars.TIMEZONE,
    RESET_DB: eVars.RESET_DB === 'true',
    ORM_VERBOSE: eVars.ORM_VERBOSE === 'true',
    USE_DATABASE: eVars.USE_DATABASE,
    SQLITE_PATH: eVars.SQLITE_PATH,
    MYSQL_HOST: eVars.MYSQL_HOST,
    MYSQL_PORT: eVars.MYSQL_PORT,
    MYSQL_DB_NAME: eVars.MYSQL_DB_NAME,
    MYSQL_USER: eVars.MYSQL_USER,
    MYSQL_PASS: eVars.MYSQL_PASS,
    ENFORCE_VALIDATION: eVars.ENFORCE_VALIDATION === 'true',
    PASS_PHRASE: eVars.PASS_PHRASE,
    SECONDARY_PHOTO_COUNT_FLOOR: eVars.SECONDARY_PHOTO_COUNT_FLOOR,
    SECONDARY_PHOTO_COUNT_CEILING: eVars.SECONDARY_PHOTO_COUNT_CEILING,
    TAG_COUNT_FLOOR: eVars.TAG_COUNT_FLOOR,
    TAG_COUNT_CEILING: eVars.TAG_COUNT_CEILING
    // PROD_HOST: eVars.PROD_HOST,
    // LOCAL_DEV_HOST: eVars.LOCAL_DEV_HOST,
    // REMOTE_DEV_HOST: eVars.REMOTE_DEV_HOST,
    // RESET_DB: eVars.RESET_DB === 'true',
    // ADMIN: eVars.ADMIN,
    // EMAIL_HOST: eVars.EMAIL_HOST,
    // EMAIL_PORT: eVars.EMAIL_PORT,
    // ADMIN_EMAIL: eVars.ADMIN_EMAIL,
    // ADMIN_EMAIL_PASSWORD: eVars.ADMIN_EMAIL_PASSWORD,
    // CLIENT_URL: `${!devMode ? prodHost : remoteDevHost}/${sysRef}`,
    // API_URL: `${!devMode ? prodHost : remoteDevHost}/${sysRef}/api`
  }
})()

function domain () {
  return !devMode ? eVars.PROD_DOMAIN : eVars.LOCAL_DEV_DOMAIN
}

function normalizePort (val) {
  var port = parseInt(val, 10)
  if (isNaN(port)) {
    return val
  }
  if (port >= 0) {
    return port
  }
  return false
}

function host () {
  return `${eVars.PROTOCOL}://${domain()}:${normalizePort(eVars.PORT)}`
}
