import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { login_user } from '../../actions'

import Hello from './Hello'

const app = document.getElementById('app')

ReactDOM.render((
    <BrowserRouter>
        <div>
            <Route exact path="/" component={Hello}/>
        </div>
    </BrowserRouter> 
), app)