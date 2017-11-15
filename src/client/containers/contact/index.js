import React from 'react'
import { Link } from 'react-router-dom'
import config from '../../config'

export default class Contact extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            auth: false,
        }
    }
    render() {
        const contact = config.contact
        const { auth } = this.state
        return( 
            <div>
                <nav className="navbar has-shadow">
                    <div className="container">
                        <nav className="tabs is-large">
                            <Link className="navbar-item is-tab" to="/">產品列表</Link>
                            {!auth &&<Link className="navbar-item is-tab" to="/login">會員登入</Link>}
                            <Link className="navbar-item is-tab" to="/register">會員註冊</Link>
                            <Link className="navbar-item is-tab is-active" to="/contact">聯絡我們</Link>
                            {auth && <Link className="navbar-item is-tab" to="/order">訂購清單</Link>}
                        </nav>
                    </div>
                </nav>
                <div className="container" style={style.container}>
                    <div>
                        <h2 className="title is-2">{contact.name}</h2>
                        <hr />
                        {Object.keys(contact.info).map((key) => {
                            return <h4 className="subtitle is-4">{contact.info[key]}</h4>
                        })}
                        <hr />
                        <h3 className="title is-3">{contact.slogan}</h3>
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