import React from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { admin_info } from '../../../actions'
import { connect } from 'react-redux'
import config from '../../../config'

const api = config.api

class Login extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            token: '',
            form: {
                loginId: '',
                password: '',
            },
            msg:{
                loginId: '',
                password: '',
            },
            isLoading: false,
        }
    }

    componentWillMount() {
        this.checkAuth()
    }

    checkAuth() {
        const { dispatch, login } = this.props
        const token = window.localStorage["jwt-token"]
        if (token) {
            let admin = []
            dispatch(admin_info(admin))
            this.props.history.push("/");
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
            if (form[key] === '') {
                msg[key] = '不得空白'
                this.setState({msg: msg})
                err = true
            } 
        })
        return err
    }

    login() {
        const { form, msg } = this.state
        const self = this
        if (this.checkSpace()) {
            return
        }
        this.loginSuccess()
        return
        axios({
            method: 'post',
            url: api + 'tokens',
            data: form,
            headers: {
                'x-access-token': window.localStorage["jwt-admin-token"],
                'Content-Type': 'application/json',
            }
        })
        .then(function (response) {
            if (response.status === 200) {
                console.log(response.data)
                window.localStorage["jwt-admin-token"] = response.data.data
                self.setState({
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
        const { dispatch, match } = this.props
        let admin = []
        dispatch(admin_info(admin))
        console.log(window.localStorage["jwt-admin-token"])
        this.props.history.push(match.url + '/product');
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
                                        <input className="input" type="text" placeholder="請輸入帳號"
                                            value={form.loginId} onChange={this.inputChange.bind(this, 'loginId')}
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

function mapStateToProps(state) {
	const { login } = state
	return {
        login
	}
}

export default connect(mapStateToProps)(Login)