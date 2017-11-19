import React from 'react'
import { BrowserRouter, Route, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { login_user } from '../actions'
import '../assets/bulma.scss'

import Content from './content'
import Product from './product'
import Login from './login'
import Register from './register'
import Order from './order'
import Admin from './admin'
import Series from './product/series'
import Contact from '../containers/contact'
import Hello from '../containers/hello'
import Logo from '../containers/logo'

class Main extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            auth: false,
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
                    <Route exact path="/" component={Product}/>
                    <Route path="/login" component={Login}/>
                    <Route path="/register" component={Register}/>
                    <Route path="/contact" component={Contact}/>
                    <Route path="/order" component={Order}/>
                    <Route path="/admin" component={Admin}/>
                    <Route path="/Series" component={Series}/>
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