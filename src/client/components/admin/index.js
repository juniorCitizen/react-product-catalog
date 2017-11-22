import React from 'react'
import { Route, Link } from 'react-router-dom'
import Product from './product'
import Order from './order'
import Series from './series'

export default class Admin extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            auth: false,
            select: {
                product: '',
                logout: '',
                order: '',
                series: '',
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

    logout() {

    }
    
    render() {
        const { auth, select } = this.state
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
                            <a onClick={this.logout.bind()}>{"登出"}</a>
                        </li>
                    </ul>
                </div>
                <Route path={url + "/product"} component={Product}/>
                <Route path={url + "/order"} component={Order}/>
                <Route path={url + "/series"} component={Series}/>
                <Route exact path={url} component={ () => (
                    <h1>admin management</h1>
                )}/>
            </div>         
        )
    }
}