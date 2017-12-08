import { 
  ADMIN_TAB,
} from '../constants/actionType'

export function set_admin_tab(tab) {
  return {type: ADMIN_TAB, tab}
}