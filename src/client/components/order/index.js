import React from 'react'
import { Link } from 'react-router-dom'
import Nav from '../navigation'

export default class Order extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            auth: false,
            show: '',
        }
    }

    show() {
        this.setState({show: 'is-active'})
    }

    hide() {
        this.setState({show: ''})
    }

    render() {
        const { auth, show } = this.state
        return(    
            <div>
                <Nav tab="order" />
                <div className="container" style={style.container}>
                <h1 className="title">
                        This is Order!!!
                    </h1>
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