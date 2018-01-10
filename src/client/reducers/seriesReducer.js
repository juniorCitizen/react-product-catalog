import {
  SERIES_CODE,
  SERIES_PATCH,
} from '../constants/actionType'

const initalState = {
  code: null,
  series: [],
}

export default function series(state = initalState, action) {
  switch (action.type) {
    case SERIES_CODE:
      return Object.assign({}, state, {
        code: action.code
      })
    case SERIES_PATCH:
      return Object.assign({}, state, {
        series: action.series
      })
    default:
      return state
  }
}

