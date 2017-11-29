import React from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import Nav from '../navigation'
import { user_info } from '../../actions'
import { connect } from 'react-redux'
import qs from 'qs'
import config from '../../config'
import { jwt_info } from '../../lib/index'

class Login extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            form: {
                email: '',
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

    componentWillMount() {
        this.checkAuth()
    }

    componentDidMount() {
        
    }

    checkAuth() {
        const { dispatch, login } = this.props
        const token = window.localStorage["jwt-token"]
        if (token) {
            dispatch(user_info(jwt_info(token)))
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
            if (form[key] === '' && !this.igone(key)) {
                console.log(key + ' can\'t  empty')
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
            return
        }
        axios({
            method: 'post',
            url: config.route.tokens,
            data: qs.stringify(form),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        })
        .then(function (response) {
            console.log(response.data)
            if (response.status === 200) {
                window.localStorage["jwt-token"] = response.data.data
                self.loginSuccess()
            } else {
                loginError(response.error.message)
            }
        }).catch(function (error) {
            console.log(error)
        })
    }

    loginSuccess() {
        const { dispatch } = this.props
        const token = window.localStorage["jwt-token"]
        dispatch(user_info(jwt_info(token)))
        this.props.history.push("/");
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
                <Nav tab="login" />
                <div className="container" style={style.container}>
                    <div className="columns">
                        <div className="column is-6 is-offset-3">
                            <div className="box is-4" style={style.box}>
                                <div className="field">
                                    <label className="label">電子郵件</label>
                                    <div className="control">
                                        <input className="input" type="text" placeholder="請輸入電子郵件"  maxLength="20"
                                            value={form.email} onChange={this.inputChange.bind(this, 'email')}
                                        />
                                    </div>
                                    <p className="help is-danger">{msg.email}</p>
                                </div>
                                <div className="field">
                                    <label className="label">密碼</label>
                                    <div className="control">
                                        <input className="input" type="password" placeholder="請輸入密碼"  maxLength="20"
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