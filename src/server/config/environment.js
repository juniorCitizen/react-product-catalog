require('dotenv').config()

const isProd = process.env.NODE_ENV === 'production'
const prodHost = process.env.PROD_HOST
const remoteDevHost = process.env.REMOTE_DEV_HOST
const sysRef = process.env.SYS_REF

module.exports = (() => {
    return {
        SYS_REF: process.env.SYS_REF,
        NODE_ENV: process.env.NODE_ENV,
        PROD_HOST: process.env.PROD_HOST,
        LOCAL_DEV_HOST: process.env.LOCAL_DEV_HOST,
        REMOTE_DEV_HOST: process.env.REMOTE_DEV_HOST,
        HOST: isProd ? process.env.PROD_HOST : process.env.REMOTE_DEV_HOST,
        PORT: process.env.PORT,
        RESET_DB: process.env.RESET_DB === 'true',
        NODEMON_VERBOSE: process.env.NODEMON_VERBOSE === 'true',
        SEQUELIZE_VERBOSE: process.env.SEQUELIZE_VERBOSE === 'true',
        ENFORCE_VALIDATION: process.env.ENFORCE_VALIDATION === 'true',
        PASS_PHRASE: process.env.PASS_PHRASE,
        TIMEZONE: process.env.TIMEZONE,
        ADMIN: process.env.ADMIN,
        EMAIL_HOST: process.env.EMAIL_HOST,
        EMAIL_PORT: process.env.EMAIL_PORT,
        ADMIN_EMAIL: process.env.ADMIN_EMAIL,
        ADMIN_EMAIL_PASSWORD: process.env.ADMIN_EMAIL_PASSWORD,
        CLIENT_URL: `${isProd ? prodHost : remoteDevHost}/${sysRef}`,
        API_URL: `${isProd ? prodHost : remoteDevHost}/${sysRef}/api`
    }
})()
