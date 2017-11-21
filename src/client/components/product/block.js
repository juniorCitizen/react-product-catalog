import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { login_user } from '../../actions'

class Block extends React.Component {
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
                block
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

export default connect(mapStateToProps)(Block)