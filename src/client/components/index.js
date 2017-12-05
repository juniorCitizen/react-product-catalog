import React from 'react'
import { BrowserRouter, Route, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import '../assets/bulma.scss'
import config from '../config'

import Content from './content'
import Product from './product'
import Detail from './product/detail'
import Login from './login'
import Register from './register'
import Order from './order'
import Admin from './admin'
import Contact from '../containers/contact'
import Hello from '../containers/hello'
import Logo from '../containers/logo'
import Modify from './modify'

class Main extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }
    //paap
    render() {
        const { login } = this.props
        const auth = login.user_info.auth
        return(  
            <BrowserRouter>  
                <div>            
                    <Logo />
                    <Route exact path={config.sys_ref + "/"} component={Product}/>
                    <Route path={config.sys_ref + "/product/detail/:id"} component={Detail}/>
                    <Route path={config.sys_ref + "/login"} component={Login}/>
                    <Route path={config.sys_ref + "/register"} component={Register}/>
                    <Route path={config.sys_ref + "/contact"} component={Contact}/>
                    {auth && <Route path={config.sys_ref + "/order"} component={Order}/>}
                    {auth && <Route path={config.sys_ref + "/modify"} component={Modify}/>}
                    <Route path={config.sys_ref + "/admin"} component={Admin}/>
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