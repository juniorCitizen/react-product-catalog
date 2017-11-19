import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { login_user } from '../../actions'

class Series extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            auth: false,
            series: {
                0: {
                    name: 'series 1',
                    active: true,
                    sub_list: {
                        0: {
                            name: 'series 1-1',
                            active: true,
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
            },
        }
    }

    render() {
        const { auth, series } = this.state
        console.log(series)
        Object.keys(series).map((key) => {
            console.log(series[key].name)
            Object.keys(series[key].sub_list).map((sub_key) => {
                console.log(series[key].sub_list[sub_key].name)
            })
        })
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
                                            <a className={series[key].sub_list[sub_key].active ? "is-active" : ""}>
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
	const { login } = state
	return {
		login
	}
}

export default connect(mapStateToProps)(Series)