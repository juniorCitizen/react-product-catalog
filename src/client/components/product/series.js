import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { login_user } from '../../actions'
import { series_list } from '../../actions'

class Series extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            auth: false,
            
            series: {
                0: {
                    name: 'series 1',
                    active: true,
                    products: true,
                    code: '',
                    sub_list: {
                        0: {
                            name: 'series 1-1',
                            active: true,
                            sub_list: {},
                        },
                        1: {
                            name: 'series 1-2',
                            active: false,
                        },
                    },
                },
                1: {
                    name: 'series 2',
                    active: false,
                    sub_list: {
                        0: {
                            name: 'series 2-1',
                        },
                    },
                },
                2: {
                    name: 'series 3',
                    active: false,
                    sub_list: {
                        0: {
                            name: 'series 3-1',
                        },
                        1: {
                            name: 'series 3-2',
                        },
                    },
                }
            }
        }
    }

    componentDidMount() {
            
    }

    selectSeries(code) {
        alert(code)
    }

    render() {
        const { auth, series } = this.state
        const { series_list } = this.props
        return(          
            <div>
                <aside className="menu">
                    <ul className="menu-list">
                        {Object.keys(series).map((key) => (
                            <li key={key}>
                                <a className={series[key].active ? "is-active" : ""}>{series[key].name}</a>
                                {series[key].active &&
                                    <ul>
                                        {Object.keys(series[key].sub_list).map((sub_key) => (
                                            <li key={sub_key}>
                                            <a className={series[key].sub_list[sub_key].active ? "is-active" : ""}
                                                onClick={this.selectSeries.bind(this, series[key].sub_list[sub_key].name)}
                                            >
                                                {series[key].sub_list[sub_key].name}</a>
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