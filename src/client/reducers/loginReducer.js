import {
    USER_INFO,
    ADMIN_INFO,
    USER_LOGOUT,
    ADMIN_LOGOUT,
} from '../constants/actionType'

const initalState = {
    user_info: {
        auth: false,
        info: [],
    },
    admin_info: {
        auth: false,
        info: [],
    }
}

export default function login(state = initalState, action) {
    switch (action.type) {
        case USER_INFO:
            return Object.assign({}, state, {
                user_info: {
                    auth: true,
                    info: action.info
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
                    info: [],
                }
            })
        case ADMIN_LOGOUT: 
            return Object.assign({}, state, {
                admin_info: {
                    auth: false,
                    info: []
                }
            })
        default:
            return state
    }
}