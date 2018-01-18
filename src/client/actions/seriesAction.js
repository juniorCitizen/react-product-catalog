import {
  SERIES_SELECTED,
  SERIES_UPDATE,
} from '../constants/actionType'

export function seriesSelected(seriesId) {
  return { type: SERIES_SELECTED, seriesId }
}

export function seriesUpdate(series) {
  return { type: SERIES_UPDATE  , series}
}