import React from 'react'
import { BrowserRouter, Route, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { login_user } from '../actions'
import '../assets/bulma.scss'

import Content from './content'
import Product from './product'
import Login from './login'
import Register from './register'
import Order from './order'
import Admin from './admin'
import Contact from '../containers/contact'
import Hello from '../containers/hello'
import Logo from '../containers/logo'
import Modify from './modify'
import NoMatch from '../containers/error404'

class Main extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
        const { login } = this.props
        return(  
            <BrowserRouter>  
                <div>            
                    <Logo />
                    <Route exact path="/" component={Product}/>
                    <Route path="/login" component={Login}/>
                    <Route path="/register" component={Register}/>
                    <Route path="/contact" component={Contact}/>
                    {login.auth && <Route path="/order" component={Order}/>}
                    {login.auth && login.isAdmin && <Route path="/admin" component={Admin}/>}
                    {login.auth && <Route path="/modify" component={Modify}/>}
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

export default connect(mapStateToProps)(Main)