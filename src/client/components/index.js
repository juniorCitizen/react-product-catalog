import React from 'react'
import { BrowserRouter, Route, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import '../assets/bulma.scss'
import config from '../config'
import { user_info } from '../actions'
import { jwt_info } from '../lib'

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

  componentDidMount() {
    this.checkLogin()
  }

  checkLogin() {
    const { dispatch, login } = this.props
    const token = window.localStorage["jwt-token"]
    if (token) {
      dispatch(user_info(jwt_info(token)))
    }
  }

  render() {
    const { login, order } = this.props
    const auth = login.user_info.auth
    const inquiry = order.order.length > 0 ? true : false
    return (
      <BrowserRouter>
        <div>
          <Logo />
          <Route exact path={config.sys_ref + "/"} component={Product} />
          <Route path={config.sys_ref + "/product/detail/:id"} component={Detail} />
          <Route path={config.sys_ref + "/login"} component={Login} />
          {inquiry && <Route path={config.sys_ref + "/register"} component={Register} />}
          <Route path={config.sys_ref + "/contact"} component={Contact} />
          <Route path={config.sys_ref + "/order"} component={Order} />
          {auth && <Route path={config.sys_ref + "/modify"} component={Modify} />}
          <Route path={config.sys_ref + "/admin"} component={Admin} />
        </div>
      </BrowserRouter>
    )
  }
}

function mapStateToProps(state) {
  const { login, order } = state
  return {
    login,
    order,
  }
}

export default connect(mapStateToProps)(Main)