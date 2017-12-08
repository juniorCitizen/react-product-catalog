import React from 'react'
import Nav from '../navigation'

export default class Order extends React.Component {
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
    this.setState({ select: select })
  }

  render() {
    const { auth, select } = this.state
    return (
      <div>
        <h1 className="title">
          This is order management!!!
        </h1>
      </div>
    )
  }
}