import React from 'react'
import { BrowserRouter, Route, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { login_user } from '../../actions'

class Function extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            auth: false,
            select: {
                product: '',
                login: '',
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
            <BrowserRouter>    
                <nav className="navbar has-shadow">
                    <div className="container">
                        <nav className="tabs is-large">
                            <Link className={"navbar-item is-tab " + select.product} 
                                onClick={this.tabActive.bind(this, 'product')} to="/">產品列表</Link>
                            <Link className={"navbar-item is-tab " + select.login} 
                                onClick={this.tabActive.bind(this, 'login')} to="/login">會員登入</Link>
                            <Link className={"navbar-item is-tab " + select.register} 
                                onClick={this.tabActive.bind(this, 'register')} to="/register">會員註冊</Link>
                            <Link className={"navbar-item is-tab " + select.contact}
                                onClick={this.tabActive.bind(this, 'contact')} to="/contact">聯絡我們</Link>
                            {auth && <Link className={"navbar-item is-tab " + select.order}
                                onClick={this.tabActive.bind(this, 'order')} to="/order">訂購清單</Link>}
                        </nav>
                    </div>
                </nav>
            </BrowserRouter> 
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