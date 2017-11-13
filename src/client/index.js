import React from 'react'
import ReactDOM from 'react-dom'
import Root from './components/root'
import { Provider } from 'react-redux'
import configureStore from './store/configureStore'
const store = configureStore();

ReactDOM.render((
    <Provider store={store}>
        <Root />
    </Provider>
), app)