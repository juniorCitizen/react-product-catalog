import React from 'react'
import './assets/bulma.scss'
import './assets/app.css'

export default class Hello extends React.Component {
    render() {
        return(
            <div>
                <span>🎨Hello World🎨</span>
                <button className="button is-primary">test</button>
                <button className="redButton">test</button>
            </div>
        )
    }
}