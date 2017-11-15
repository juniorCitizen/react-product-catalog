import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route, Link } from 'react-router-dom'
import { Provider } from 'react-redux'
import Main from './components'
import Admin from './components/admin'
import configureStore from './store/configureStore'
const store = configureStore();

ReactDOM.render((
    <Provider store={store}>
        <BrowserRouter> 
            <div>
                <Route exact path="/" component={Main}/>  
                <Route path="/admin" component={Admin}/>  
            </div>
        </BrowserRouter> 
    </Provider>
), app) 


