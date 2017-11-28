import { 
    UPDATE_ORDER,
} from '../constants/actionType'
  
export function update_order(order) {
    return {type: UPDATE_ORDER, order}
}