import React from 'react'
import '../../assets/bulma.scss'

export default class Hello extends React.Component {
    render() {
        return(
            <div>
                <span>🎨Hello World🎨</span>
                <button className="button is-primary">test</button>
            </div>
        )
    }
}