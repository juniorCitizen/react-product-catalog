import React from 'react'
import { BrowserRouter, Route, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { login_user } from '../../actions'

class Navbar extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            auth: false,
            select: {
                product: '',
                login: '',
                logout: '',
                modify: '',
                register: '',
                contact: '',
                order: '',
            },
        }
    }

    componentDidMount() {
        let { tab } = this.props
        this.tabActive(tab)
    }

    tabActive(tab) {
        let select = this.state
        Object.keys(select).map((key) => {
            select[key] = ''
        })
        select[tab] = 'is-active'
        this.setState({select: select})
    }

    render() {
        const { auth, select } = this.state
        return( 
            <div className="container">
                <div className="tabs is-centered is-large">
                    <ul>
                        <li>
                            <Link className={select.product} 
                                onClick={this.tabActive.bind(this, 'product')} to="/">產品列表</Link>
                        </li>
                        {auth ? 
                            <li>
                                <Link className={select.logout} 
                                    onClick={this.tabActive.bind(this, 'logout')} to="/logout">會員登出</Link>
                            </li>
                        :
                            <li>
                                <Link className={select.login} 
                                    onClick={this.tabActive.bind(this, 'login')} to="/login">會員登入</Link>
                            </li>
                        }
                        {auth ?
                            <li>
                                <Link className={select.modify} 
                                    onClick={this.tabActive.bind(this, 'modify')} to="/modify">修改會員資料</Link>
                            </li>
                        :
                            <li>
                                <Link className={select.register} 
                                    onClick={this.tabActive.bind(this, 'register')} to="/register">會員註冊</Link>
                            </li>
                        }
                        
                        <li>
                            <Link className={select.contact}
                                onClick={this.tabActive.bind(this, 'contact')} to="/contact">聯絡我們</Link>
                        </li>
                        {auth && 
                            <li>
                                <Link className={select.order}
                                    onClick={this.tabActive.bind(this, 'order')} to="/order">訂購清單</Link>
                            </li>
                        }
                    </ul>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
	const { login } = state
	return {
		login
	}
}

export default connect(mapStateToProps)(Function)