import React from 'react'
import axios from 'axios'
import { set_series_code } from '../../actions'
import { connect } from 'react-redux'
import config from '../../config'

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
        series = this.setSeriesActive(series, id)
        this.setState({
            series: series,
        })
    }

    setSeriesActive(series, id) {
        series && series.map((item) => {
            item.selected = item.id === id
            item.tagMenus && item.tagMenus.map((sub) => {
                if (sub.id === id) {
                    item.selected = true
                }
            })
            item.tagMenus = this.setSeriesActive(item.tagMenus, id)
        })
        return series
    }

    getSeries() {
        const self = this
        axios({
            method: 'get',
            url: config.route.productMenu,
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
                                <a className={item.selected ? "is-active" : ""} onClick={this.selectSeries.bind(this, item.id)}>{item.name}</a>
                                {item.tagMenus && item.selected &&
                                    <ul>
                                        {item.tagMenus.map((item, index) => (
                                            <li key={index}>
                                            <a className={item.selected ? "is-active" : ""}
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