import React from 'react'
import { Route, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { admin_info, admin_logout } from '../../actions'
import { jwt_info } from '../../lib'
import Product from './product'
import Order from './order'
import Series from './series'
import Confirm from '../../containers/modal/confirm'
import Login from './login'
import User from './user'
import config from '../../config'

import Test from './test'

class Admin extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      select: {
        product: '',
        logout: '',
        order: '',
        series: '',
        user: ''
      },
      confirmShow: false,
      confirmMsg: ''
    }
  }

  componentWillMount() {
    this.checkAdmin()
  }

  componentDidMount() {
    const { location, match } = this.props
    let lonum = location.pathname.length
    let manum = match.url.length
    let tab = location.pathname.substr(manum + 1, lonum - manum)
    this.tabActive(tab)
  }

  checkAdmin() {
    const { dispatch, login } = this.props
    const token = window.localStorage['jwt-admin-token']
    console.log(token)
    if (token) {
      let user = jwt_info(token)
      if (user.exp*1000 > new Date().getTime()) {
        console.log(user)
        dispatch(admin_info(user))
      }
    }
  }

  tabActive(tab) {
    let select = this.state
    Object.keys(select).map((key) => {
      select[key] = ''
    })
    select[tab] = 'is-active'
    this.setState({ select: select })
  }

  logoutConfirm() {
    this.setState({
      confirmShow: true,
      confirmMsg: '您確定要登出嗎？'
    })
  }

  logout() {
    const { dispatch } = this.props
    window.localStorage['jwt-admin-token'] = ''
    dispatch(admin_logout())
    this.setState({ confirmShow: false })
    this.props.history.push(config.sys_ref + '/admin')
  }

  render() {
    const { select, confirmShow, confirmMsg } = this.state
    const { login, params, match } = this.props
    const url = match.url
    const auth = login.admin_info.auth
    return (
      <div>
        {auth &&
          <div className="container">
            <div className="tabs is-large">
              <ul>
                <li className={select.product}>
                  <Link onClick={this.tabActive.bind(this, 'product')} to={url + '/product'}>產品管理</Link>
                </li>
                {false && <li className={select.order}>
                  <Link onClick={this.tabActive.bind(this, 'order')} to={url + '/order'}>訂單管理</Link>
                </li>}
                <li className={select.series}>
                  <Link onClick={this.tabActive.bind(this, 'series')} to={url + '/series'}>產品分類管理</Link>
                </li>
                {false && <li className={select.user}>
                  <Link onClick={this.tabActive.bind(this, 'user')} to={url + '/user'}>帳號管理</Link>
                </li>}
                <li className={select.logout}>
                  <a onClick={this.logoutConfirm.bind(this)}>{'登出'}</a>
                </li>
              </ul>
            </div>
          </div>
        }
        {auth
          ? <div className="container">
            <Route path={url + '/product'} component={Product}/>
            {false && <Route path={url + '/order'} component={Order}/>}
            <Route path={url + '/series'} component={Series}/>
            {false && <Route path={url + '/user'} component={User}/>}
            <Route path={url + '/test'} component={Test}/>
          </div>
          : <Route exact path={url} component={Login} />
        }
        <Confirm
          show={confirmShow}
          message={confirmMsg}
          click_ok={this.logout.bind(this)}
          click_cancel={() => { this.setState({ confirmShow: false }) }}
        />
      </div>
    )
  }
}

function mapStateToProps(state) {
  const { login, params } = state
  return {
    login,
    params,
  }
}

export default connect(mapStateToProps)(Admin)
