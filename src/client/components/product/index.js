import React from 'react'
import { connect } from 'react-redux'
import Nav from '../navigation'
import Series from './series'
import Block from './block'

class Product extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
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