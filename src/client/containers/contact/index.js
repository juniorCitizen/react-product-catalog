import React from 'react'
import { Link } from 'react-router-dom'
import config from '../../config'
import Navigation from '../../components/navigation'

export default class Contact extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            auth: false,
        }
    }
    render() {
        const contact = config.contact
        const { auth } = this.state
        return( 
            <div>
                <Navigation tab="contact"/>
                <div className="container" style={style.container}>
                    <div>
                        <h2 className="title is-2">{contact.name}</h2>
                        <hr />
                        {Object.keys(contact.info).map((key) => {
                            return <h4 key={key} className="subtitle is-4">{contact.info[key]}</h4>
                        })}
                        <hr />
                        <h3 className="title is-3">{contact.slogan}</h3>
                    </div>
                </div>
            </div>
        )
    }
}

const style = {
    box: {
        marginTop: '10px',
    },
    container: {
        padding: '10px',
    },
}