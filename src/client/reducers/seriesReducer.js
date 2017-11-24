import {
    SERIES_CODE,
} from '../constants/actionType'
import axios from 'axios'

const initalState = {
    code: null,
}

export default function series(state = initalState, action) {
    switch (action.type) {
        case SERIES_CODE:
            return Object.assign({}, state, {
                code: action.code
            })
        default:
            return state
    }
}

