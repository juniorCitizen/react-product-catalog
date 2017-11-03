import React from 'react'
import ReactDOM from 'react-dom'
import {
    HashRouter,
    Route,
    Link
} from 'react-router-dom'
import Hello from './Hello'

ReactDOM.render((
    <HashRouter>
        <div>
            <Route exact path="/" component={Hello} />
        </div>
    </HashRouter >
), document.getElementById('root') )