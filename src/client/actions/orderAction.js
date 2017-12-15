import { 
    UPDATE_ORDER,
    ADD_ORDER,
    REMOVE_ORDER,
} from '../constants/actionType'
  
export function update_order(orders) {
    return {type: UPDATE_ORDER, orders}
}

export function add_order(order) {
    return {type: ADD_ORDER, order}
}

export function remove_order(id) {
    return {type: REMOVE_ORDER, id}
}