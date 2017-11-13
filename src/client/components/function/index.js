import React from 'react'
import { BrowserRouter, Route, Link } from 'react-router-dom'

export default class Function extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            auth: false
        }
    }
    render() {
        const { auth } = this.state
        return( 
            <BrowserRouter>    
                <nav className="navbar has-shadow">
                    <div className="container">
                        <nav className="tabs">
                            <Link className="navbar-item is-tab is-active" to="/product">產品列表</Link>
                            <Link className="navbar-item is-tab" to="/login">會員登入</Link>
                            <Link className="navbar-item is-tab" to="/register">會員註冊</Link>
                            <Link className="navbar-item is-tab" to="/contact">聯絡我們</Link>
                            {auth && <Link className="navbar-item is-tab" to="/order">訂購清單</Link>}
                        </nav>
                    </div>
                </nav>
            </BrowserRouter> 
        )
    }
}