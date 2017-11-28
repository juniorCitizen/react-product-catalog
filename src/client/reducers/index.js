import { combineReducers } from 'redux'
import login from './loginReducer'
import series from './seriesReducer'
import order from './orderReducer'
import product from './productReducer'

const rootReducer = combineReducers({
    login,
    series,
    order,
    product,
})

export default rootReducer