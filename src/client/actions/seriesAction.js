import { 
    SERIES,
} from '../constants/actionType'
  
export function getSerise(series_code) {
    return {type: SERIES, series_code}
}