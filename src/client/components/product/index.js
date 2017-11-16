import React from 'react'
import { Link } from 'react-router-dom'
import Navigation from '../navigation'
import { connect } from 'react-redux'
import { login_user } from '../../actions'

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
                <Navigation tab="product"/>
                <div className="container" style={style.container}>
                    <h1>this product</h1>
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