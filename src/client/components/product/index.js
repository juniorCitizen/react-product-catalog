import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { login_user } from '../../actions'
import Nav from '../navigation'
import Series from './series'
import Block from './block'

class Product extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            auth: false,
        }
    }

    render() {
        const { auth } = this.state
        return(          
            <div>
                <Nav tab="product"/>
                <div className="container" style={style.container}>
                    <div className="columns">
                        <div className="column is-one-fifth">
                            <Series />
                        </div>
                        <div className="column">
                            <Block />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const style = {
    container: {
        padding: '10px',
    },
}

function mapStateToProps(state) {
	const { login } = state
	return {
		login
	}
}

export default connect(mapStateToProps)(Product)