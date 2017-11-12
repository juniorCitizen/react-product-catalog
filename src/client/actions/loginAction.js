import { 
    LOGIN_USER,
} from '../constants/actionType'
  
export function login_user(user_info) {
    return {type: LOGIN_USER, user_info}
}