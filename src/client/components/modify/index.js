import React from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import Nav from '../navigation'
import { user_info } from '../../actions'
import { connect } from 'react-redux'
import config from '../../config'
import qs from 'qs'
import { jwt_info } from '../../lib/index'

class Modify extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      form: {
        email: '',
        name: '',
        address: '',
        telephone: '',
        botPrevention: null,
      },
      msg: {
        name: '',
        address: '',
        telephone: '',
        submit: '',
      },
      isLoading: false,
    }
  }

  componentDidMount() {
    this.checkAuth()
    this.getUserInfo()
    console.log(this.props.login.user_info.info)
  }

  checkAuth() {
    const { dispatch, login } = this.props
    const token = window.localStorage["jwt-token"]
    if (token) {
      dispatch(user_info(jwt_info(token)))
    } else {
      this.props.history.push(config.sys_ref + "/login")
    }
  }

  getUserInfo() {
    const self = this
    const info = this.props.login.user_info.info
    let url = config.route.contacts.contacts + info.id
    axios({
      method: 'get',
      url: url,
      data: null,
      headers: {
        'x-access-token': window.localStorage["jwt-token"],
      }
    })
      .then(function (response) {
        if (response.status === 200) {
          self.setData(response.data.data)
        } else {
          console.log(response)
        }
      }).catch(function (error) {
        console.log(error)
      })
  }

  setData(data) {
    let form = this.state.form
    form.email = data.email
    form.name = data.name
    form.address = data.company['address']
    form.telephone = data.company['telephone']
    this.setState({ form: form })
  }

  inputChange(cont, e) {
    let text = e.target.value
    let { form, msg } = this.state
    form[cont] = text
    msg[cont] = ''
    this.setState({ form: form })
    this.checkPassword()
  }

  checkPassword() {
    let { form, msg } = this.state
    if (form.password !== form.confirm) {
      msg.confirm = '密碼與確認密碼不一致'
      this.setState({ msg: msg })
      return
    }
    this.setState({ msg: msg })
  }

  checkSpace() {
    let { form, msg } = this.state
    let err = false
    Object.keys(form).map((key) => {
      if (form[key] === '') {
        console.log(key + ' can\'t  empty')
        msg[key] = '必填'
        this.setState({ msg: msg })
        err = true
      }
    })
    return err
  }

  submit() {
    if (this.checkSpace()) {
      return
    }
    const { login } =  this.props
    const { form, msg } = this.state
    const self = this
    delete form.email
    console.log(form)
    axios({
      method: 'put',
      url: config.route.contacts.contacts + login.user_info.info.id,
      data: qs.stringify(form),
      headers: {
        'x-access-token': window.localStorage["jwt-token"],
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    })
      .then(function (response) {
        console.log(response.data)
        if (response.status === 200) {
          self.props.history.push(config.sys_ref + "/")
        } else {
          self.submitError(res.msg)
        }
      }).catch(function (error) {
        console.log(error)
      })
  }

  submitError(str) {
    let msg = this.state.msg
    msg.submit = str
    self.setState({
      msg: msg,
      isLoading: false
    })
  }

  render() {
    const { form, msg, isLoading } = this.state
    return (
      <div>
        <Nav tab="modify" />
        <div className="container" style={style.container}>
          <div className="columns">
            <div className="column is-6 is-offset-3">
              <div className="box" style={style.box}>
                <div className="field">
                  <label className="label">電子郵件</label>
                  <div className="control">
                    <input className="input" type="text" placeholder="請輸入電子郵件" disabled={true}
                      value={form.email} onChange={this.inputChange.bind(this, 'email')}
                    />
                  </div>
                  <p className="help is-danger">{msg.email}</p>
                </div>
                <div className="field">
                  <label className="label">姓名/公司行號</label>
                  <div className="control">
                    <input className="input" type="text" placeholder="請輸入姓名或公司行號"
                      value={form.name} onChange={this.inputChange.bind(this, 'name')}
                    />
                  </div>
                  <p className="help is-danger">{msg.name}</p>
                </div>
                <div className="field">
                  <label className="label">地址</label>
                  <div className="control">
                    <input className="input" type="text" placeholder="請輸入地址"
                      value={form.address} onChange={this.inputChange.bind(this, 'address')}
                    />
                  </div>
                  <p className="help is-danger">{msg.address}</p>
                </div>
                <div className="field">
                  <label className="label">聯絡電話</label>
                  <div className="control">
                    <input className="input" type="text" placeholder="請輸入聯絡電話"
                      value={form.telephone} onChange={this.inputChange.bind(this, 'telephone')}
                    />
                  </div>
                  <p className="help is-danger">{msg.telephone}</p>
                </div>
                <div className="field-body">
                  <div className="field">
                    <div className="control">
                      <button className="button is-primary" onClick={this.submit.bind(this)}>
                        註冊帳號
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

export default connect(mapStateToProps)(Modify)