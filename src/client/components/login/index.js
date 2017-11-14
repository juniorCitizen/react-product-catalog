import React from 'react'

export default class Login extends React.Component {
    render() {
        return(          
            <div className="box">
                <div className="field">
                    <label className="label">電子郵件</label>
                    <div className="control">
                        <input className="input" type="text" placeholder="請輸入電子郵件" />
                    </div>
                </div>
                <div className="field">
                    <label className="label">密碼</label>
                    <div className="control">
                        <input className="input" type="password" placeholder="請輸入密碼" />
                    </div>
                </div>
                <div className="field">
                    <label className="label">確認密碼</label>
                    <div className="control">
                        <input className="input" type="password" placeholder="再次確認密碼" />
                    </div>
                    <p className="help is-danger">This email is invalid</p>
                </div>
            </div>
        )
    }
}