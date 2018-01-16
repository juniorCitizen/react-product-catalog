import React from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import config from '../../config'
import Detail from './detail'

const api = config.api
const route = config.route

class Block extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      list: [],
      hot_list: [],
      new_list: [],
      current: 0,
      total: 0,
      show_detail: false,
    }
  }

  getProductList(code) {
    console.log('series code:' + code)
    if (code === null) {
      return
    }
    return
    axios({
      method: 'get',
      url: api + 'product/' + code + '/1',
      data: null,
      headers: {
        'x-access-token': window.localStorage["jwt-token"],
        'Content-Type': 'application/json',
      }
    })
      .then(function (response) {
        if (response.status === 200) {
          let data = response.data
          self.setState({
            list: data.list,
            current: data.current,
            total: data.total,
          })
          self.loginSuccess()
        } else {
          console.log(response.data)
        }
      }).catch(function (error) {
        console.log(error)
      })
  }

  showDetail(item) {
    this.setState({
      show_detail: true,
    })
    this.refs.detail.getWrappedInstance().getProductInfo(item.id)
  }

  hideDetail() {
    this.setState({
      show_detail: false,
    })
    this.refs.detail.getWrappedInstance().doClear()
  }

  render() {
    const { series, product, order } = this.props
    const { list, hot_list, new_list, show_detail } = this.state
    return (
      <div>
        {series.code &&
          <div className="columns is-multiline" style={{ marginTop: '1px' }}>
            {product.products.map((item, index) => (
              <div className="column is-2" key={index} style={style.images}>
                <div className="v-image-box" onClick={this.showDetail.bind(this, item)}>
                  <img className="v-image" src={getPhoto(item)} />
                  {order.order.map((list, index) => {
                      if (list.id === item.id) {
                        return (
                          <span className="icon has-text-warning v-image-order-tag" key={index}>
                            <i className="fa fa-star"></i>
                          </span>
                        )
                      }
                    })
                  }
                  <div className="v-image-label">
                    {item.name}
                  </div>
                </div>
              </div>
            ))}
          </div>
        }
        <Detail show={show_detail} ref="detail" hide={this.hideDetail.bind(this)} />
      </div>
    )
  }
}

const style = {
  images: {
    margin: '2px',
    padding: '0',
    height: '256px',
    width: '256px',
  }
}

function getPhoto(product) {
  if (product.photos.length > 0) {
    return route.photos.getPhoto + product.photos[0].id
  }
  return null
}

function isOrdered(data, order) {
  order.map((item, index) => {
    if (item.id === data.id) {
      return (true)
    }
  })
  return (false)
}

function mapStateToProps(state) {
  const { series, product, order } = state
  return {
    series,
    product,
    order,
  }
}

export default connect(mapStateToProps)(Block)