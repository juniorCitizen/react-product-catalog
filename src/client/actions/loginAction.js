import { 
    LOGIN_USER,
    AUTH_STATE,
    IS_ADMIN,
} from '../constants/actionType'
  
export function login_user(user_info) {
    return {type: LOGIN_USER, user_info}
}

export function auth_state(auth) {
    return {type: AUTH_STATE, auth}
}

export function isAdmin(isAdmin) {
    return {type: IS_ADMIN, isAdmin}
}