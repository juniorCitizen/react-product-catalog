import React from 'react'
import { Link } from 'react-router-dom'

export default class Register  extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            auth: false,
            form: {
                email: '',
                password: '',
                confirm: '',
                name: '',
                address: '',
                contact: '',
            },
            msg:{
                email: '',
                password: '',
                confirm: '',
                name: '',
                address: '',
                contact: '',
                submit: '',
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

    checkEmail() {
        
    }

    checkPassword() {
        let { form, msg } = this.state
        if (form.password !== form.confirm) {
           msg.confirm = '密碼與確認密碼不一致'
           this.setState({msg: msg}) 
        }
    }

    checkSpace() {
        let { form, msg } = this.state
        let err = false
        Object.keys(form).map((key) => {
            if (form[key] === '') {
                msg[key] = '必填'
                this.setState({msg: msg})
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
        let url = ''
        let form_data = new FormData()
        Object.keys(form).map((key) => {
            form_data.append(key, form[key])
        })

        axios.post(url, form_data)
        .then(function (response) {
            let res = response.data
            if (res.result) {
                self.submitSuccess()
            } else {
                self.submitError(res.msg)
            }
        }).catch(function (error) {
            console.log(error)
            self.submitError(error)
        })
        
    }

    submitSuccess() {

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
        const { auth, form, msg } = this.state
        return (
            <div>
                <nav className="navbar has-shadow">
                    <div className="container">
                        <nav className="tabs is-large">
                            <Link className="navbar-item is-tab" to="/">產品列表</Link>
                            {!auth &&<Link className="navbar-item is-tab" to="/login">會員登入</Link>}
                            <Link className="navbar-item is-tab is-active" to="/register">會員註冊</Link>
                            <Link className="navbar-item is-tab" to="/contact">聯絡我們</Link>
                            {auth && <Link className="navbar-item is-tab" to="/order">訂購清單</Link>}
                        </nav>
                    </div>
                </nav>
                <div className="container" style={style.container}>
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
                                    value={form.contact} onChange={this.inputChange.bind(this, 'contact')}
                                />
                            </div>
                            <p className="help is-danger">{msg.contact}</p>
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