import {
    UPDATE_PRODUCTS,
} from '../constants/actionType'

const initalState = {
    products: [],
}

export default function product(state = initalState, action) {
    switch (action.type) {
        case UPDATE_PRODUCTS:
            return Object.assign({}, state, {
                products: action.products
            })
        default:
            return state
    }
}

