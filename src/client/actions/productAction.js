import {
  UPDATE_PRODUCTS,
} from '../constants/actionType'

export function updateProducts(products) {
  return { type: UPDATE_PRODUCTS, products }
}