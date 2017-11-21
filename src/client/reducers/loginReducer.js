import {
    LOGIN_USER,
    AUTH_STATE,
} from '../constants/actionType'

const initalState = {
    auth: false,
    user_info: {
        id: null,
        name: null,
        email: null,
    },
}

export default function login(state = initalState, action) {
    switch (action.type) {
        case LOGIN_USER:
            return Object.assign({}, state, {
                user_info: action.user_info
            })
        case AUTH_STATE:
            return Object.assign({}, state, {
                auth: action.auth,
            })
        default:
            return state
    }
}