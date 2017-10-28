import { decode } from 'jsonwebtoken'

export default {
    namespaced: true,
    state: {
        jwt: sessionStorage.jwt || null,
        company: sessionStorage.company || '',
        name: sessionStorage.name || '',
        email: sessionStorage.email || '',
        countryId: sessionStorage.jwt || ''
    },
    mutations: {
        register: (state, jwt) => {
            state.jwt = jwt
            sessionStorage.jwt = jwt
        },
        reset: (state) => {
            state.jwt = sessionStorage.jwt || null
            state.company = sessionStorage.company || ''
            state.name = sessionStorage.name || ''
            state.email = sessionStorage.email || ''
            state.countryId = sessionStorage.countryId || ''
        },
        logout: (state) => {
            sessionStorage.removeItem('jwt')
            state.jwt = null
        },
        rememberUser: (state, payload) => {
            sessionStorage.company = payload.company
            state.company = payload.company
            sessionStorage.name = payload.name
            state.name = payload.name
            sessionStorage.email = payload.email
            state.email = payload.email
            sessionStorage.countryId = payload.countryId
            state.countryId = payload.countryId
        },
        forgetUser: (state) => {
            sessionStorage.removeItem('company')
            state.company = ''
            sessionStorage.removeItem('name')
            state.name = ''
            sessionStorage.removeItem('email')
            state.email = ''
            sessionStorage.removeItem('countryId')
            state.countryId = ''
        }
    },
    getters: {
        jwt: (state) => { return state.jwt },
        email: (state) => {
            return state.jwt !== null ? extractPayload(state.jwt, 'email') : null
        },
        loginId: (state) => {
            return state.jwt !== null ? extractPayload(state.jwt, 'loginId') : null
        },
        user: (state) => {
            return {
                company: state.company,
                name: state.name,
                email: state.email,
                countryId: state.countryId
            }
        },
        registered: (state) => {
            return (
                state.company !== '' &&
                state.name !== '' &&
                state.email !== '' &&
                state.countryId !== ''
            )
        }
    },
    actions: {}
}

function extractPayload(token, propertyName) {
    return decode(token, { complete: true }).payload[propertyName]
}
