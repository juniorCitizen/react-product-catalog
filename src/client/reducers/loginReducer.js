import {
    LOGIN_USER,
} from '../constants/actionType'

const initalState = {
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
        default:
            return state
    }
}