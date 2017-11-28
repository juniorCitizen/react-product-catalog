import {
    UPDATE_PRODUCTS,
} from '../constants/actionType'

const initalState = {
    products: [
        {id: 1, name: '111', des: 'des111'},
        {id: 2, name: '222', des: 'des222'},
        {id: 3, name: '333', des: 'des333'},
        {id: 4, name: '444', des: 'des444'},
        {id: 5, name: '555', des: 'des555'},
    ],
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

