import React from 'react'

export default class User extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            item: {},
        }
        this.setState({item: this.props.item})
    }

    inputChange(cont, e) {
        let text = e.target.value
        let { form, msg } = this.state
        form[cont] = text
        msg[cont] = ''
        this.setState({ form: form })
        this.checkPassword()
    }
    
    render() {
        const { show, click_cancel } = this.props
        const { item } = this.state
        return( 
            <div class="modal">
                <div class="modal-background"></div>
                <div class="modal-card">
                    <header class="modal-card-head">
                        <p class="modal-card-title">Modal title</p>
                        <button class="delete" aria-label="close"></button>
                    </header>
                    <section class="modal-card-body">
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
                                    value={confirm} onChange={this.inputChange.bind(this, 'confirm')}
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
                    </section>
                    <footer class="modal-card-foot">
                        <button class="button is-success" onClick={click_save(item)}>儲存</button>
                        <button class="button" onClick={click_cancel}>取消</button>
                    </footer>
                </div>
          </div>
        )
    }
}