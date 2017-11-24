import React from 'react'
import { Link } from 'react-router-dom'
import Nav from '../navigation'

export default class Modify extends React.Component {
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
                <Nav tab="modify" />
                <div className="container" style={style.container}>
                    <h1 className="title">
                        This is Modify!!!
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