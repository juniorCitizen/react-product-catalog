import React from 'react'

export default class Error404 extends React.Component {
    render() {
        console.log(this.props.match)
        return(
            <div className="container">
                <span className="tag is-black">喔不!您到了不該到的地方了!</span>
            </div>
        )
    }
}