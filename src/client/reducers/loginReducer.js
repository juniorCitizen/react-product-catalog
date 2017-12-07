import {
    USER_INFO,
    ADMIN_INFO,
    USER_LOGOUT,
    ADMIN_LOGOUT,
} from '../constants/actionType'

const initalState = {
    user_info: {
        auth: false,
        info: null,
    },
    admin_info: {
        auth: false,
        info: null,
    }
}

export function login(state = initalState, action) {
    switch (action.type) {
        case USER_INFO:
            return Object.assign({}, state, {
                user_info: {
                    auth: true,
                    info: action.info,
                }
            })
        case ADMIN_INFO:
            return Object.assign({}, state, {
                admin_info: {
                    auth: true,
                    info: action.info,
                }
            })
        case USER_LOGOUT:
            return Object.assign({}, state, {
                user_info: {
                    auth: false,
                    info: null,
                }
            })
        case ADMIN_LOGOUT: 
            return Object.assign({}, state, {
                admin_info: {
                    auth: false,
                    info: null,
                }
            })
        default:
            return state
    }
}