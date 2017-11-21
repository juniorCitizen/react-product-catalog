import { 
    SERIES,
} from '../constants/actionType'
  
export function get_series(series_code = null) {
    return {type: SERIES, series_code}
}