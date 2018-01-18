import {
  SELECTED_SERIES_ID,
  UPDATE_SERIES,
} from '../constants/actionType'

export function selectedSeriesId(seriesId) {
  return { type: SELECTED_SERIES_ID, seriesId }
}

export function updateSeries(series) {
  return { type: UPDATE_SERIES, series}
}