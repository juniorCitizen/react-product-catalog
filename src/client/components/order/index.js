import React from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import Nav from '../navigation'
import { connect } from 'react-redux'
import config from '../../config'
import { remove_order } from '../../actions'

class Order extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      list: []
    }
  }

  componentDidMount() {
    const { order } = this.props
    this.setState({list: order.order})
  }

  removeOrder(id) {
    console.log(id)
    const { dispatch } = this.props
    dispatch(remove_order(id))
  }

  render() { 
    const { order } = this.props
    const { list } = this.state
    const inquiry = order.order.length > 0 ? true: false
    console.log(order.order)
    return (
      <div>
        <Nav tab="order" />
        <div className="container" style={style.container}>

          {inquiry ?
            <table className="table is-bordered is-striped is-narrow is-fullwidth">
              <tbody>
                {list.map((item, index) => (
                  <tr key={index}>
                    <td width="146">
                      <figure className="image is-128x128">
                        <img style={style.image} src={config.route.photos.getPhoto + item.photos[0].id}/>
                      </figure>
                    </td>
                    <td>
                      <h4 className="title is-4">{item.name}</h4>
                      <p>{item.specification}</p>
                    </td>
                    <td style={style.remove}>
                      <button className="button is-danger" onClick={this.removeOrder.bind(this, item.id)}>刪除</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          :
            <span>no data!</span>
          }
        </div>
      </div>
    )
  }
}

const style = {
  container: {
    padding: '10px',
  },
  image: {
    width: '128px',
    height: '128px',
  },
  remove: {
    verticalAlign: 'middle'
  }
}

function mapStateToProps(state) {
  const { order } = state
  return {
    order,
  }
}

export default connect(mapStateToProps, null, null, { withRef: true })(Order)