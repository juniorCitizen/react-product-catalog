import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { login_user } from '../../actions'

import Hello from '../../Hello'

class root extends Component { 
    render () {
        return (
            <BrowserRouter>
                <div>
                    <Route exact path="/" component={Hello}/>
                </div>
            </BrowserRouter> 
        )
    }
}

function mapStateToProps(state) {
	const { login } = state
	return {
		login
	}
}

export default connect(mapStateToProps)(root)