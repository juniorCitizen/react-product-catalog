import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { login_user } from '../../actions'

class Product extends React.Component {
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
                            <Link className="navbar-item is-tab is-active" to="/">產品列表</Link>
                            {!auth &&<Link className="navbar-item is-tab" to="/login">會員登入</Link>}
                            <Link className="navbar-item is-tab" to="/register">會員註冊</Link>
                            <Link className="navbar-item is-tab" to="/contact">聯絡我們</Link>
                            {auth && <Link className="navbar-item is-tab" to="/order">訂購清單</Link>}
                        </nav>
                    </div>
                </nav>
                <div className="container" style={style.container}>
                    <h1>this product</h1>
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

function mapStateToProps(state) {
	const { login } = state
	return {
		login
	}
}

export default connect(mapStateToProps)(Product)