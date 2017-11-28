import React from 'react'

class Detail extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
        /*
        const { message, click_ok, click_cancel} = this.props
        const btn_ok = this.props.btn_ok || this.state.btn_ok
        const btn_cancel = this.props.btn_cancel || this.state.btn_cancel
        const icon = this.props.icon || this.state.icon
        const iconType = this.props.iconType || this.state.iconType
        */
        const { info } = this.props
        const show = this.props.show ? ' is-active': ''
        return(    
            <div className={"modal" + show}>
                <div className="modal-background"></div>
                <div className="modal-large">
                    <div className="columns">
                        <div className="column is-half">
                            <img src="https://bulma.io/images/placeholders/256x256.png" />
                        </div>
                        <div className="column">
                            <h1 className="title is-1">{info.name}</h1>
                            <h3 className="title is-3">{info.specification}</h3>
                            <h3 className="title is-3">{info.description}</h3>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Detail