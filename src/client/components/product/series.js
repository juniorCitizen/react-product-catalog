import React from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { login_user } from '../../actions'
import { series_list } from '../../actions'
import config from '../../config'

const url = config.server.host + config.project.name + '/api'

class Series extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            auth: false,
            series: [],
        }
    }

    componentDidMount() {
        axios({
            method: 'get',
            url: 'http://localhost:9004/reactProductCatalog/api/series',
            data:{},
            headers: {
                'Access-Control-Allow-Origin': '*',
                "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",  
                'Accept': 'application/json'  
            }
        })
        .then(function (response) {
            if (response.data.statusCode === 200) {
                self.setState({
                    series: response.data
                })
                console.log(response.data)
            } else {
                console.log(response.data)
            }
        }).catch(function (error) {
            console.log(error)
        })
    }

    selectSeries(code) {
        console.log('select series' + code)
    }

    render() {
        const { auth, series } = this.state
        const { series_list } = this.props
        return(          
            <div>
                <aside className="menu">
                    <ul className="menu-list">
                        {series.map((item, index) => (
                            <li key={index}>
                                <a className={item.active ? "is-active" : ""} onClick={this.selectSeries.bind(this, item.id)}>{item.name}</a>
                                {item.sub_list &&
                                    <ul>
                                        {item.sub_list.map((item, index) => (
                                            <li key={index}>
                                            <a className={item.active ? "is-active" : ""}
                                                onClick={this.selectSeries.bind(this, item.id)}
                                            >
                                                {item.name}</a>
                                            </li>
                                        ))}
                                    </ul>
                                }
                            </li>
                        ))}
                    </ul>
              </aside>
            </div>
        )
    }
}

const style = {

}

function mapStateToProps(state) {
	const { login, series } = state
	return {
        login,
        series,
	}
}

export default connect(mapStateToProps)(Series)