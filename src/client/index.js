import React from 'react'
import ReactDOM from 'react-dom'
import Main from './components'
import { Provider } from 'react-redux'
import configureStore from './store/configureStore'
const store = configureStore();

ReactDOM.render((
    <Provider store={store}>
        <Main />
    </Provider>
), app) 
