import React from 'react'
import { connect } from 'react-redux'

class Detail extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
        return(          
            <div className="">
                detail
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

export default connect(mapStateToProps)(Detail)