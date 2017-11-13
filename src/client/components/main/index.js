import React from 'react'
import { BrowserRouter, Route, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { login_user } from '../../actions'
import '../../assets/bulma.scss'

import Content from '../content'
import Function from '../function'
import Product from '../product'
import Login from '../login'
import Register from '../register'
import Contact from '../contact'
import Order from '../order'

import Hello from '../../containers/hello'
import Logo from '../../containers/logo'

class Main extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            auth: false,
        }
    }

    componentDidMount() {

    }

    render() {
        const { auth } = this.state
        return(  
            <BrowserRouter>  
                <div>            
                    <section className="hero is-light">
                        <div className="hero-head">
                            <div className="container">
                                <Logo />
                            </div>
                        </div>
                    </section>
                    <nav className="navbar has-shadow">
                        <div className="container">
                            <nav className="tabs">
                                <Link className="navbar-item is-tab is-active" to="/">產品列表</Link>
                                <Link className="navbar-item is-tab" to="/login">會員登入</Link>
                                <Link className="navbar-item is-tab" to="/register">會員註冊</Link>
                                <Link className="navbar-item is-tab" to="/contact">聯絡我們</Link>
                                {auth && <Link className="navbar-item is-tab" to="/order">訂購清單</Link>}
                            </nav>
                        </div>
                    </nav>
                    <div className="container">
                        <Route exact path="/" component={Product}/>
                        <Route path="/login" component={Login}/>
                        <Route path="/register" component={Register}/>
                        <Route path="/contact" component={Contact}/>
                        <Route path="/order" component={Order}/>
                    </div>
                </div>
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

export default connect(mapStateToProps)(Main)