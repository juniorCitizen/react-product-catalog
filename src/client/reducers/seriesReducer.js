import {
  SELECTED_SERIES_ID,
  UPDATE_SERIES,
} from '../constants/actionType'

const initalState = {
  selectedId: null,
  series: [],
}

export default function series(state = initalState, action) {
  switch (action.type) {
    case SELECTED_SERIES_ID:
      return Object.assign({}, state, {
        selectedId: action.seriesId
      })
    case UPDATE_SERIES:
      return Object.assign({}, state, {
        series: action.series
      })
    default:
      return state
  }
}

