import React from 'react'
import { Link } from 'react-router-dom'

export default class Order extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            auth: false,
        }
    }

    render() {
        const { auth } = this.state
        return(    
            <div>
                <nav className="navbar has-shadow">
                    <div className="container">
                        <nav className="tabs is-large">
                            <Link className="navbar-item is-tab" to="/">產品列表</Link>
                            {!auth &&<Link className="navbar-item is-tab" to="/login">會員登入</Link>}
                            <Link className="navbar-item is-tab" to="/register">會員註冊</Link>
                            <Link className="navbar-item is-tab" to="/contact">聯絡我們</Link>
                            {auth && <Link className="navbar-item is-tab is-active" to="/order">訂購清單</Link>}
                        </nav>
                    </div>
                </nav>
                <div className="container" style={style.container}>
                    <h1 className="title">
                        This is Order!!!
                    </h1>
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