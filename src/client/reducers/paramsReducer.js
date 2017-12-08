import {
  ADMIN_TAB,
} from '../constants/actionType'

const initalState = {
  admin_tab: ''
}

export default function params(state = initalState, action) {
  switch (action.type) {
      case ADMIN_TAB:
          return Object.assign({}, state, {
              admin_tab: action.tab
          })
      default:
          return state
  }
}

