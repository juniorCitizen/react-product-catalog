import React from 'react'
import { Link } from 'react-router-dom'
import Navigation from '../navigation'

export default class Order extends React.Component {
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
                <Navigation tab="order"/>
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