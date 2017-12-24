import {
  USER_INFO,
  ADMIN_INFO,
  USER_LOGOUT,
  ADMIN_LOGOUT,
} from '../constants/actionType'

export function user_info(info) {
  return { type: USER_INFO, info }
}

export function admin_info(info) {
  return { type: ADMIN_INFO, info }
}

export function user_logout() {
  return { type: USER_LOGOUT }
}

export function admin_logout() {
  return { type: ADMIN_LOGOUT }
}