import React from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import Nav from '../navigation'
import config from '../../config'

const api = config.api

export default class Login extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            auth: false,
            token: '',
            form: {
                email: '',
                loginId: '',
                password: '',
                botPrevention: '',
            },
            msg:{
                email: '',
                password: '',
            },
            isLoading: false,
        }
    }

    componentDidMount() {

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
                msg[key] = '不得空白'
                this.setState({msg: msg})
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
            console.log('check space is false')
            return
        }
        axios({
            method: 'post',
            url: api + 'tokens',
            data: form,
            headers: {
                'x-access-token': window.localStorage["jwt-token"],
                'Content-Type': 'application/json',
            }
        })
        .then(function (response) {
            if (response.status === 200) {
                console.log(response.data)
                window.localStorage["jwt-token"] = response.data.data
                self.setState({
                    auth: true,
                    token: response.data.data,
                })
                self.loginSuccess()
            } else {
                console.log(response.data)
            }
        }).catch(function (error) {
            console.log(error)
        })
    }

    loginSuccess() {
        console.log('login success')
    }

    loginError(str) {
        let msg = this.state.msg
        msg.submit = str
        self.setState({
            msg: msg,
            isLoading: false
        })
    }

    render() {
        const { auth, form, msg } = this.state
        return (
            <div>
                <Nav tab="login" />
                <div className="container" style={style.container}>
                    <div className="columns">
                        <div className="column is-6 is-offset-3">
                            <div className="box is-4" style={style.box}>
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
                                <div className="field-body">
                                    <div className="field">
                                        <div className="control">
                                            <button className="button is-primary" onClick={this.login.bind(this)}>
                                                登入
                                            </button>
                                            <span className="help is-danger">{msg.login}</span>
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
