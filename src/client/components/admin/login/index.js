import React from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { admin_info } from '../../../actions'
import { connect } from 'react-redux'
import config from '../../../config'
import qs from 'qs'
import { jwt_info } from '../../../lib/index'

class Login extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      form: {
        email: '',
        password: '',
        botPrevention: '',
      },
      msg: {
        email: '',
        password: '',
      },
      isLoading: false,
    }
  }

  componentWillMount() {
    this.checkAuth()
  }

  checkAuth() {
    const { dispatch, login, match } = this.props
    const token = window.localStorage["jwt-admin-token"]
    if (token) {
      dispatch(admin_info(jwt_info(token)))
      this.props.history.push(match.url);
    }
  }

  inputChange(cont, e) {
    let text = e.target.value
    let { form, msg } = this.state
    form[cont] = text
    msg[cont] = ''
    this.setState({ form: form })
  }

  checkSpace() {
    let { form, msg } = this.state
    let err = false
    Object.keys(form).map((key) => {
      if (form[key] === '' && !this.igone(key)) {
        console.log(key + ' can\'t  empty')
        msg[key] = '不得空白'
        this.setState({ msg: msg })
        err = true
      }
    })
    return err
  }

  igone(key) {
    let igone = ['botPrevention']
    let check = false
    igone.map((item) => {
      if (item === key) {
        check = true
      }
    })
    return check
  }

  login() {
    const { form, msg } = this.state
    const self = this
    if (this.checkSpace()) {
      return
    }
    axios({
      method: 'post',
      url: config.route.contacts.tokens,
      data: qs.stringify(form),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    })
      .then(function (response) {
        if (response.status === 200) {
          console.log(response.data)
          self.tokenCheck(response.data.data)
        } else {
          console.log(response.data)
        }
      }).catch(function (error) {
        console.log(error)
      })
  }

  tokenCheck(token) {
    if (jwt_info(token).admin) {
      window.localStorage["jwt-admin-token"] = token
      this.loginSuccess()
      return
    }
    this.loginError('您沒有管理員權限')
  }

  loginSuccess() {
    const { dispatch, match } = this.props
    const token = window.localStorage["jwt-admin-token"]
    if (token) {
      dispatch(admin_info(jwt_info(token)))
      this.props.history.push(match.url);
    }
  }

  loginError(str) {
    let msg = this.state.msg
    msg.submit = str
    this.setState({
      msg: msg,
      isLoading: false
    })
  }

  render() {
    const { form, msg } = this.state
    return (
      <div>
        <div className="container" style={style.container}>
          <div className="columns">
            <div className="column is-6 is-offset-3">
              <div className="box is-4" style={style.box}>
                <div className="field">
                  <label className="label">帳號</label>
                  <div className="control">
                    <input className="input" type="text" placeholder="請輸入帳號" maxLength="20"
                      value={form.email} onChange={this.inputChange.bind(this, 'email')}
                    />
                  </div>
                  <p className="help is-danger">{msg.email}</p>
                </div>
                <div className="field">
                  <label className="label">密碼</label>
                  <div className="control">
                    <input className="input" type="password" placeholder="請輸入密碼" maxLength="20"
                      value={form.password} onChange={this.inputChange.bind(this, 'password')}
                    />
                  </div>
                  <p className="help is-danger">{msg.password}</p>
                </div>
                <div className="field-body">
                  <div className="field">
                    <div className="control">
                      <button className="button is-primary" onClick={this.login.bind(this)}>
                        登入
                                            </button>
                      <span className="help is-danger">{msg.submit}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const style = {
  box: {
    marginTop: '10px',
  },
  container: {
    padding: '10px',
  },
}

function mapStateToProps(state) {
  const { login } = state
  return {
    login
  }
}

export default connect(mapStateToProps)(Login)