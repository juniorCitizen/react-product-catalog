import React from 'react'

export default class Series extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            auth: false,
            select: {
                product: '',
                logout: '',
                order: '',
            },
        }
    }

    componentDidMount() {
        let { tab } = this.props
        this.tabActive(tab)
    }

    tabActive(tab) {
        let select = this.state
        Object.keys(select).map((key) => {
            select[key] = ''
        })
        select[tab] = 'is-active'
        this.setState({select: select})
    }

    logout() {

    }
    render() {
        const { auth, select } = this.state
        return( 
            <h1 className="title">
                This is series management!!!
            </h1>         
        )
    }
}