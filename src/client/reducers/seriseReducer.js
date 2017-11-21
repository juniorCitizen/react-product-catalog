import {
    SERIES,
} from '../constants/actionType'
import axios from 'axios'

const initalState = {
    series_list: [],
}

export default function serise(state = initalState, action) {
    switch (action.type) {
        case SERIES:
            let code = action.series_code
            let series_list = {
                0: {
                    name: 'series 1',
                    active: true,
                    sub_list: {
                        0: {
                            name: 'series 1-1',
                            active: true,
                        },
                        1: {
                            name: 'series 1-2',
                            active: false,
                        },
                    },
                },
                1: {
                    name: 'series 2',
                    active: false,
                    sub_list: {
                        0: {
                            name: 'series 2-1',
                        },
                    },
                },
                2: {
                    name: 'series 3',
                    active: false,
                    sub_list: {
                        0: {
                            name: 'series 3-1',
                        },
                        1: {
                            name: 'series 3-2',
                        },
                    },
                }
            }

            return Object.assign({}, state, {
                series_list: series_list
            })
        default:
            return state
    }
}
