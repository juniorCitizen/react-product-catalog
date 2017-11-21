import { combineReducers } from 'redux'
import login from './loginReducer'
import serise from './seriseReducer'

const rootReducer = combineReducers({
    login,
    serise,
})

export default rootReducer