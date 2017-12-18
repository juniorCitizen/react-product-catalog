import React from 'react'
import axios from 'axios'
import { BrowserRouter, Route, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { user_info, user_logout } from '../../actions'
import Confirm from '../../containers/modal/confirm'
import { jwt_info } from '../../lib/index'
import config from '../../config'

class Navigation extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      select: {
        product: '',
        login: '',
        logout: '',
        modify: '',
        register: '',
        contact: '',
        order: '',
      },
      confirmShow: false,
      confirmMsg: '',
    }
  }

  componentDidMount() {
    let { tab } = this.props
    this.checkLogin()
    this.tabActive(tab)
  }

  tabActive(tab) {
    let select = this.state
    Object.keys(select).map((key) => {
      select[key] = ''
    })
    select[tab] = 'is-active'
    this.setState({ select: select })
  }

  checkLogin() {
    const { dispatch, login } = this.props
    const token = window.localStorage["jwt-token"]
    if (token) {
      //dispatch(user_info(jwt_info(token)))
      this.checkToken(token)
    }
  }

  checkToken(token) {
    const { dispatch, login } = this.props
    const self = this
    const user = jwt_info(token)
    axios({
      method: 'get',
      url: config.route.contacts.contacts + user.id,
      data: null,
      headers: {
        'x-access-token': token,
      }
    })
      .then(function (response) {
        dispatch(user_info(jwt_info(token)))
      }).catch(function (response, error) {
        if (response.request.status === 401) {
          window.localStorage["jwt-token"] = ''
          dispatch(user_logout())
          window.location = config.sys_ref + '/'
        } else {
          console.log(error)
        }
      })
  }

  logoutConfirm() {
    this.setState({
      confirmShow: true,
      confirmMsg: '您確定要登出嗎？'
    })
  }

  logout() {
    const { dispatch } = this.props
    window.localStorage["jwt-token"] = ''
    dispatch(user_logout())
    window.location = config.sys_ref + '/'
  }

  render() {
    const { select, confirmShow, confirmMsg } = this.state
    const { login, order } = this.props
    const auth = login.user_info.auth
    const inquiry = order.order.length > 0 ? true : false
    return (
      <div>
        <div className="container">
          <div className="tabs is-large">
            <ul>
              <li className={select.product}>
                <Link onClick={this.tabActive.bind(this, 'product')} to={config.sys_ref + "/"}>產品列表</Link>
              </li>
              {inquiry &&
                <li className={select.order}>
                  <Link className="button is-large is-orange" style={{ color: "#FFF" }} onClick={this.tabActive.bind(this, 'order')}
                    to={config.sys_ref + "/order"}
                  >
                    詢價單
                                    </Link>
                </li>
              }
              <li className={select.contact}>
                <Link onClick={this.tabActive.bind(this, 'contact')} to={config.sys_ref + "/contact"}>聯絡我們</Link>
              </li>
              {auth &&
                <li className={select.modify}>
                  <Link onClick={this.tabActive.bind(this, 'modify')} to={config.sys_ref + "/modify"}>修改會員資料</Link>
                </li>
              }
              {auth ?
                <li className={select.logout}>
                  <a onClick={this.logoutConfirm.bind(this)}>會員登出</a>
                </li>
                :
                <li className={select.login}>
                  <Link onClick={this.tabActive.bind(this, 'login')} to={config.sys_ref + "/login"}>會員登入</Link>
                </li>
              }

              {false &&
                <li className={select.register}>
                  <Link onClick={this.tabActive.bind(this, 'register')} to={config.sys_ref + "/register"}>會員註冊</Link>
                </li>
              }
            </ul>
          </div>
        </div>
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
  const { login, order } = state
  return {
    login,
    order,
  }
}

export default connect(mapStateToProps)(Navigation)