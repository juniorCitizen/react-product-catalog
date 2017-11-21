import React from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { login_user } from '../../actions'
import { get_series } from '../../actions'
import config from '../../config'

const api = config.api

class Series extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            auth: false,
            series: [],
        }
    }

    componentDidMount() {
        const { dispatch } = this.props;
        this.getSeries()
    }

    selectSeries(code) {
        console.log('select series' + code)
    }

    getSeries() {
        const self = this
        axios({
            method: 'get',
            url: api + 'series',
            data: {},
            headers: {
                'x-access-token': window.localStorage["jwt-token"]
            }
        })
        .then(function (response) {
            if (response.status === 200) {
                console.log(response.data)
                self.setState({
                    series: response.data.data
                })
            } else {
                console.log(response.data)
            }
        }).catch(function (error) {
            console.log(error)
        })
    }

    render() {
        const { auth, series } = this.state
        const { login } = this.props
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

function mapStateToProps(state) {
	const { login } = state
	return {
        login
	}
}

export default connect(mapStateToProps)(Series)