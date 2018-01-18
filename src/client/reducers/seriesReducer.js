import {
  SERIES_SELECTED,
  SERIES_UPDATE,
} from '../constants/actionType'

const initalState = {
  selectedId: null,
  series: [],
}

export default function series(state = initalState, action) {
  switch (action.type) {
    case SERIES_SELECTED:
      return Object.assign({}, state, {
        selectedId: action.id
      })
    case SERIES_UPDATE:
      return Object.assign({}, state, {
        series: action.series
      })
    default:
      return state
  }
}

