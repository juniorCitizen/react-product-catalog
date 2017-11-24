import React from 'react'
import axios from 'axios'
import { set_series_code } from '../../actions'
import { connect } from 'react-redux'
import config from '../../config'

const api = config.api

class Series extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            series: [],
            alertShow: false,
            alertMsg: '',
        }
    }

    componentDidMount() {
        this.getSeries()
    }

    selectSeries(id) {
        const { dispatch } = this.props;
        dispatch(set_series_code(id))
        let series = this.state.series
        series = series.map((item) => {
            let setItem = item
            setItem.active = item.id === id
            return setItem
        })
        this.setState({
            series: series,
        })
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
        const { series, alertShow, alertMsg } = this.state
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
	const { series } = state
	return {
        series
	}
}

export default connect(mapStateToProps)(Series)