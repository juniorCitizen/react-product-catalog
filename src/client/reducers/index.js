import { combineReducers } from 'redux'
import login from './loginReducer'
import series from './seriesReducer'

const rootReducer = combineReducers({
    login,
    series,
})

export default rootReducer