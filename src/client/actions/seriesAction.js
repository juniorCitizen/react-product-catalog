import {
  SERIES_CODE,
  SERIES_PATCH,
} from '../constants/actionType'

export function set_series_code(code) {
  return { type: SERIES_CODE, code }
}

export function series_patch(series) {
  return { type: SERIES_PATCH, series}
}