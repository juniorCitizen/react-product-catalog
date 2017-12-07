import React from 'react'
import axios from 'axios'

export default class Form extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            form: {},
            msg:{
                email: '',
                password: '',
                confirm: '',
                name: '',
                address: '',
                telephone: '',
                submit: '',
            },
        }
    }

    componentDidMount() {
        this.setState({form: this.props.item})
    }

    inputChange(cont, e) {
        let text = e.target.value
        let { form, msg } = this.state
        form[cont] = text
        msg[cont] = ''
        this.setState({ form: form })
        //this.checkPassword()
    }

    checkedChange(e) {
        const val = e.target.value
        let form = this.state.form
        form.admin = val
        this.setState({form: form})
    }

    doSave(){
        console.log(this.state.form)
        return
        axios({
            method: 'post',
            url: '',
            data: null,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        })
        .then(function (response) {
            console.log(response.data)
            if (response.status === 200) {
                
            } else {
                
            }
        }).catch(function (error) {
            console.log(error)
        })
    }
    
    render() {
        const { title, show, click_save, click_cancel } = this.props
        const { form, msg } = this.state
        const active = show? ' is-active': ''
        return( 
            <div className={"modal" + active}>
                <div className="modal-background"></div>
                <div className="modal-card">
                    <header className="modal-card-head">
                        <p className="modal-card-title">{title}</p>
                        <button className="delete" aria-label="close"></button>
                    </header>
                    <section className="modal-card-body">
                        <div className="field">
                            <label className="label">電子郵件</label>
                                <div className="control">
                                    <input className="input" type="text" placeholder="請輸入電子郵件"
                                        value={form.email||''} onChange={this.inputChange.bind(this, 'email')}
                                    />
                                </div>
                                <p className="help is-danger">{msg.email}</p>
                            </div>
                        <div className="field">
                            <label className="label">密碼</label>
                            <div className="control">
                                <input className="input" type="password" placeholder="請輸入密碼"
                                    value={form.password||''} onChange={this.inputChange.bind(this, 'password')}
                                />
                            </div>
                            <p className="help is-danger">{msg.password}</p>
                        </div>
                        <div className="field">
                            <label className="label">確認密碼</label>
                            <div className="control">
                                <input className="input" type="password" placeholder="再次確認密碼"
                                    value={form.confirm||''} onChange={this.inputChange.bind(this, 'confirm')}
                                />
                            </div>
                            <p className="help is-danger">{msg.confirm}</p>
                        </div>
                        <div className="field">
                            <label className="label">姓名/公司行號</label>
                            <div className="control">
                                <input className="input" type="text" placeholder="請輸入姓名或公司行號"
                                    value={form.name||''} onChange={this.inputChange.bind(this, 'name')}
                                />
                            </div>
                            <p className="help is-danger">{msg.name}</p>
                        </div>
                        <div className="field">
                            <label className="label">地址</label>
                            <div className="control">
                                <input className="input" type="text" placeholder="請輸入地址"
                                    value={form.address||''} onChange={this.inputChange.bind(this, 'address')}
                                />
                            </div>
                            <p className="help is-danger">{msg.address}</p>
                        </div>
                        <div className="field">
                            <label className="label">聯絡電話</label>
                            <div className="control">
                                <input className="input" type="text" placeholder="請輸入聯絡電話" 
                                    value={form.telephone||''} onChange={this.inputChange.bind(this, 'telephone')}
                                />
                            </div>
                            <p className="help is-danger">{msg.telephone}</p>
                        </div>
                        <div className="field">
                            <label className="label">是否為管理者</label>
                                <div className="control">
                                    <label className="radio">
                                        <input type="radio" name="is-admin"
                                            value="true" checked={form.admin === "true"} onChange={this.checkedChange.bind(this)}/>
                                        Yes
                                    </label>
                                    <label className="radio">
                                        <input type="radio" name="is-admin" 
                                            value="false" checked={form.admin||'false' === "false"} onChange={this.checkedChange.bind(this)}/>
                                        No
                                    </label>
                                </div>
                        </div>
                    </section>
                    <footer className="modal-card-foot">
                        <button className="button is-success" onClick={this.doSave.bind(this)}>儲存</button>
                        <button className="button" onClick={click_cancel}>取消</button>
                    </footer>
                </div>
          </div>
        )
    }
}