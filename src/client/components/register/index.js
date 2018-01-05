import React from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import Nav from '../navigation'
import { user_info, update_order } from '../../actions'
import { connect } from 'react-redux'
import config from '../../config'
import qs from 'qs'
import { jwt_info } from '../../lib/index'

class Register extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      form: {
        email: '',
        password: '',
        confirm: '',
        name: '',
        address: '',
        telephone: '',
        company: '',
        botPrevention: null,
      },
      msg: {
        email: '',
        password: '',
        confirm: '',
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
  }

  checkAuth() {
    const { dispatch, login } = this.props
    const token = window.localStorage["jwt-token"]
    if (token) {
      dispatch(user_info(jwt_info(token)))
      this.props.history.push(config.sys_ref + "/");
    }
  }

  inputChange(cont, e) {
    let text = e.target.value
    let { form, msg } = this.state
    form[cont] = text
    form.company = form.name
    msg[cont] = ''
    this.setState({ form: form })
    this.checkPassword()
  }

  checkEmail() {

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
    const { form, msg } = this.state
    const order =  this.props.order.order
    for (let i = 0; i < order.length; i++) {
      form['productIdList['+i+']'] = order[i].id
      form['quantities['+i+']'] = 1
    }
    const self = this
    let url = ''
    delete form.confirm;
    console.log(form)
    axios({
      method: 'post',
      url: config.route.contacts.register,
      data: qs.stringify(form),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    })
    .then(function (response) {
      console.log(response.data)
      if (response.status === 200) {
        window.localStorage["jwt-token"] = response.data.data
        self.cleanOrder()
        self.submitSuccess()
      } else {
        self.submitError(res.msg)
      }
    }).catch(function (error) {
      console.log(error)
    })
  }

  cleanOrder() {
    const { dispatch } = this.props
    dispatch(update_order([]))
  }

  submitSuccess() {
    const { dispatch } = this.props
    const token = window.localStorage["jwt-token"]
    dispatch(user_info(jwt_info(token)))
    this.props.history.push(config.sys_ref + "/")
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
        <Nav tab="register" />
        <div className="container" style={style.container}>
          <div className="columns">
            <div className="column is-6 is-offset-3">
              <div className="box" style={style.box}>
                <div className="field">
                  <label className="label">電子郵件</label>
                  <div className="control">
                    <input className="input" type="text" placeholder="請輸入電子郵件"
                      value={form.email} onChange={this.inputChange.bind(this, 'email')}
                    />
                  </div>
                  <p className="help is-danger">{msg.email}</p>
                </div>
                <div className="field">
                  <label className="label">密碼</label>
                  <div className="control">
                    <input className="input" type="password" placeholder="請輸入密碼"
                      value={form.password} onChange={this.inputChange.bind(this, 'password')}
                    />
                  </div>
                  <p className="help is-danger">{msg.password}</p>
                </div>
                <div className="field">
                  <label className="label">確認密碼</label>
                  <div className="control">
                    <input className="input" type="password" placeholder="再次確認密碼"
                      value={form.confirm} onChange={this.inputChange.bind(this, 'confirm')}
                    />
                  </div>
                  <p className="help is-danger">{msg.confirm}</p>
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
  box: {
    marginTop: '10px',
  },
  container: {
    padding: '10px',
  },
}

function mapStateToProps(state) {
  const { login, order } = state
  return {
    login,
    order,
  }
}

export default connect(mapStateToProps)(Register)