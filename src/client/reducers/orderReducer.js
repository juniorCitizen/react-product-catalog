import {
  UPDATE_ORDER,
  ADD_ORDER,
  REMOVE_ORDER,
} from '../constants/actionType'

const initalState = {
  order: [],
}

export default function order(state = initalState, action) {
  switch (action.type) {
    case ADD_ORDER:
      state.order.push(action.order)
      return Object.assign({}, state, {
        order: state.order
      })
    case REMOVE_ORDER:
      let newOrder = state.order
      for (let i = 0; i < state.order.length; i++) {
        if (state.order[i].id === action.id) {
          newOrder.splice(i, 1)
        }
      }
      return Object.assign({}, state, {
        order: newOrder
      })
    case UPDATE_ORDER:
      return Object.assign({}, state, {
        order: action.orders
      })
    default:
      return state
  }
}

