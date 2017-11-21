import { 
    LOGIN_USER,
    AUTH_STATE,
} from '../constants/actionType'
  
export function login_user(user_info) {
    return {type: LOGIN_USER, user_info}
}

export function auth_state(auth) {
    return  {type: AUTH_STATE, auth}
}