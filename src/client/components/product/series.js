import React from 'react'
import axios from 'axios'
import config from '../../config'
import Alert from '../../containers/modal/alert'

const api = config.api

export default class Series extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            series: [],
            alertShow: false,
            alertMsg: '',
        }
    }

    componentDidMount() {
        const { dispatch } = this.props;
        this.getSeries()
    }

    selectSeries(id) {
        let series = this.state.series
        series = series.map((item) => {
            let setItem = item
            setItem.active = item.id === id
            return setItem
        })
        this.setState({
            series: series,
            alertShow: true,
            alertMsg: '您選擇了系列號' + id,
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
                <Alert 
                    show={alertShow}
                    message={alertMsg} 
                    click_ok={() => {this.setState({alertShow: false})}} 
                />
            </div>
        )
    }
}