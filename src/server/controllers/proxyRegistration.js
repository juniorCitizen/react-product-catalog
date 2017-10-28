import axios from 'axios'

import eVars from '../config/environment'

module.exports = (() => {
    let axiosOptions = {
        method: 'get',
        url: `http://localhost/register?reference=${eVars.SYS_REF}&proxyPath=/${eVars.SYS_REF}&targetUrl=http://localhost:${eVars.PORT}`
    }
    return axios(axiosOptions)
        .then((response) => {
            return {
                registrationStatus: true,
                message: response
            }
        })
        .catch((error) => {
            console.log(error.message)
            return {
                registrationStatus: false,
                error: error.name,
                message: error.message,
                data: error.stack
            }
        })
})()
