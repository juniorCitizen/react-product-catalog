import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { login_user } from '../../actions'

class Series extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            auth: false,
        }
    }

    componentDidMount() {

    }

    render() {
        const { auth } = this.state
        return (
            <nav className="panel">
                <p className="panel-heading">
                    repositories
                </p>
                <div className="panel-block">
                    <p className="control has-icons-left">
                    <input className="input is-small" type="text" placeholder="search" />
                    <span className="icon is-small is-left">
                        <i className="fa fa-search"></i>
                    </span>
                    </p>
                </div>
                <a className="panel-block is-active">
                    <span className="panel-icon">
                        <i className="fa fa-book"></i>
                    </span>
                    bulma
                </a>
                <a className="panel-block">
                    <span className="panel-icon">
                        <i className="fa fa-book"></i>
                    </span>
                    marksheet
                </a>
                <a className="panel-block">
                    <span className="panel-icon">
                        <i className="fa fa-book"></i>
                    </span>
                    minireset.css
                </a>
                <a className="panel-block">
                    <span className="panel-icon">
                        <i className="fa fa-book"></i>
                    </span>
                    jgthms.github.io
                </a>
                <a className="panel-block">
                    <span className="panel-icon">
                        <i className="fa fa-code-fork"></i>
                    </span>
                    daniellowtw/infboard
                </a>
                <a className="panel-block">
                    <span className="panel-icon">
                        <i className="fa fa-code-fork"></i>
                    </span>
                    mojs
                </a>
            </nav>
        )
    }
}

function mapStateToProps(state) {
	const {login} = state
	return {
                        login
                    }
                    }

export default connect(mapStateToProps)(Series)