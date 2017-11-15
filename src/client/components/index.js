import React from 'react'
import { BrowserRouter, Route, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { login_user } from '../actions'
import '../assets/bulma.scss'

import Content from './content'
import Function from './function'
import Product from './product'
import Login from './login'
import Register from './register'
import Order from './order'
import Admin from './admin'

import Contact from '../containers/contact'
import Hello from '../containers/hello'
import Logo from '../containers/logo'

class Main extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            auth: false,
            select: {
                product: 'is-active',
                login: '',
                register: '',
                contact: '',
                order: '',
            },
        }
    }

    componentDidMount() {

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
                    <div className="container" style={style.container}>
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

const style = {
    container: {
        padding: '10px',
    },
}

function mapStateToProps(state) {
	const { login } = state
	return {
		login
	}
}

export default connect(mapStateToProps)(Main)