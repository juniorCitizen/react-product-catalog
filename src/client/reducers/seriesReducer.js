import {
    SERIES,
} from '../constants/actionType'
import axios from 'axios'

const initalState = {
    series_list: [],
}

export default function series(state = initalState, action) {
    switch (action.type) {
        case SERIES:
            return Object.assign({}, state, {
                series_list: action.series_list
            })
        default:
            return state
    }
}

