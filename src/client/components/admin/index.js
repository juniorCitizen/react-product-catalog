import React from 'react'
import { Route, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { auth_state, isAdmin } from '../../actions'
import Product from './product'
import Order from './order'
import Series from './series'
import Confirm from '../../containers/modal/confirm'

class Admin extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            select: {
                product: '',
                logout: '',
                order: '',
                series: '',
            },
            confirmShow: false,
            confirmMsg: '',
        }
    }

    componentDidMount() {
        let { tab } = this.props
        this.checkAdmin()
        this.tabActive(tab)
    }

    checkAdmin() {
        const { dispatch, login } = this.props
        const token = window.localStorage["jwt-token"]
        if (!login.auth && !login.isAdmin) {
            this.logout()
        }
        if (token && isAdmin) {
            dispatch(auth_state(true))
            dispatch(isAdmin(true))
        }
    }

    tabActive(tab) {
        let select = this.state
        Object.keys(select).map((key) => {
            select[key] = ''
        })
        select[tab] = 'is-active'
        this.setState({select: select})
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
        const { match } = this.props
        const url = match.url
        return( 
            <div className="container">
                <div className="tabs is-large">
                    <ul>
                        <li className={select.product}> 
                            <Link onClick={this.tabActive.bind(this, 'product')} to={url + "/product"}>產品管理</Link>
                        </li>
                        <li className={select.order}> 
                            <Link onClick={this.tabActive.bind(this, 'order')} to={url + "/order"}>訂單管理</Link>
                        </li>
                        <li className={select.series}> 
                            <Link onClick={this.tabActive.bind(this, 'series')} to={url + "/series"}>產品分類管理</Link>
                        </li>
                        <li className={select.logout}> 
                            <a onClick={this.logoutConfirm.bind(this)}>{"登出"}</a>
                        </li>
                    </ul>
                </div>
                <Route path={url + "/product"} component={Product}/>
                <Route path={url + "/order"} component={Order}/>
                <Route path={url + "/series"} component={Series}/>
                <Route exact path={url} component={ () => (
                    <h1>admin management</h1>
                )}/>
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

export default connect(mapStateToProps)(Admin)