import { combineReducers } from 'redux'
import login from './loginReducer'
import series from './seriesReducer'
import order from './orderReducer'
import product from './productReducer'
import params from './paramsReducer'

const rootReducer = combineReducers({
    login,
    series,
    order,
    product,
    params,
})

export default rootReducer