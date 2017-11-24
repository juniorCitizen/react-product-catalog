import React from 'react'
import { Link } from 'react-router-dom'
import config from '../../config'
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
                <img src={config.server + "/reactProductCatalog/api/photos/240858FE-CBC6-4C39-9396-585BD3C7B827"} />
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