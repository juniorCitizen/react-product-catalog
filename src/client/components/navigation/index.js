import React from 'react'
import { BrowserRouter, Route, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { auth_state, isAdmin } from '../../actions'
import Confirm from '../../containers/modal/confirm'

class Navigation extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            select: {
                product: '',
                login: '',
                logout: '',
                modify: '',
                register: '',
                contact: '',
                order: '',
            },
            confirmShow: false,
            confirmMsg: '',
        }
    }

    componentDidMount() {
        let { tab } = this.props
        this.checkLogin()
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

    checkLogin() {
        const { dispatch, login } = this.props
        const token = window.localStorage["jwt-token"]
        if (token) {
            dispatch(auth_state(true))
        }
    }

    logoutConfirm() {
        this.setState({
            confirmShow: true,
            confirmMsg: '您確定要登出嗎？'
        })
    }

    logout() {
        const { dispatch } = this.props
        window.localStorage["jwt-token"] = ''
        dispatch(auth_state(false))
        dispatch(isAdmin(false))
        this.props.history.push("/");
    }

    render() {
        const { select, confirmShow, confirmMsg } = this.state
        const { login } = this.props
        const auth = login.auth
        console.log(login)
        return( 
            <div>
                <div className="container">
                    <div className="tabs is-large">
                        <ul>
                            <li className={select.product}> 
                                <Link onClick={this.tabActive.bind(this, 'product')} to="/">產品列表</Link>
                            </li>
                            {auth ? 
                                <li className={select.logout}>
                                    <a onClick={this.logoutConfirm.bind(this)}>會員登出</a>
                                </li>
                            :
                                <li className={select.login}>
                                    <Link onClick={this.tabActive.bind(this, 'login')} to="/login">會員登入</Link>
                                </li>
                            }
                            {auth ?
                                <li className={select.modify}>
                                    <Link onClick={this.tabActive.bind(this, 'modify')} to="/modify">修改會員資料</Link>
                                </li>
                            :
                                <li className={select.register}>
                                    <Link onClick={this.tabActive.bind(this, 'register')} to="/register">會員註冊</Link>
                                </li>
                            }
                            
                            <li className={select.contact}>
                                <Link onClick={this.tabActive.bind(this, 'contact')} to="/contact">聯絡我們</Link>
                            </li>
                            {auth && 
                                <li className={select.order}>
                                    <Link onClick={this.tabActive.bind(this, 'order')} to="/order">訂購清單</Link>
                                </li>
                            }
                            {login.isAdmin &&
                                <li>
                                    <Link to="/admin">後台管理</Link>
                                </li>
                            }
                        </ul>
                    </div>
                </div>
                <Confirm 
                    show={confirmShow}
                    message={confirmMsg} 
                    click_ok={this.logout.bind(this)} 
                    click_cancel={() => {this.setState({confirmShow: false})}} 
                />
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

export default connect(mapStateToProps)(Navigation)