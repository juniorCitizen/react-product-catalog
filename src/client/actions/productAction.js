import { 
    UPDATE_PRODUCTS,
} from '../constants/actionType'
  
export function update_products(products) {
    return {type: UPDATE_PRODUCTS, products}
}