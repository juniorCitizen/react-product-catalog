import React from 'react'
import config from '../../config'

export default class Contact extends React.Component {
    render() {
        const contact = config.contact
        return( 
            <div>
                <h2 className="title is-2">{contact.name}</h2>
                <hr />
                {Object.keys(contact.info).map((key) => {
                    return <h4 key={key} className="subtitle is-4">{contact.info[key]}</h4>
                })}
                <hr />
                <h3 className="title is-3">{contact.slogan}</h3>
            </div>
        )
    }
}