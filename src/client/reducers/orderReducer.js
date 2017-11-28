import {
    UPDATE_ORDER,
} from '../constants/actionType'

const initalState = {
    order: null,
}

export default function order(state = initalState, action) {
    switch (action.type) {
        case UPDATE_ORDER:
            return Object.assign({}, state, {
                order: action.order
            })
        default:
            return state
    }
}

