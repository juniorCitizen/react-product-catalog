import { 
    SERIES_CODE,
} from '../constants/actionType'
  
export function set_series_code(code) {
    return {type: SERIES_CODE, code}
}