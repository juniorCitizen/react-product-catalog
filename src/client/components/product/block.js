import React from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import config from '../../config'
import Detail from './detail'

const api = config.api

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

  getHotList() {
    this.setState({ hot_list: [] })
  }

  getNewList() {
    this.setState({ new_list: [] })
  }

  getProductList(code) {
    console.log('series code:' + code)
    if (code === null) {
      //this.getHotList()
      //this.getNewList()
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
    const { series, product } = this.props
    const { list, hot_list, new_list, show_detail } = this.state
    return (
      <div>
        {series.code &&
          <div className="columns is-multiline" style={{ marginTop: '1px' }}>
            {product.products.map((item, index) => (
              <div className="column is-2" key={index} style={style.images}>
                <div className="v-image-box" onClick={this.showDetail.bind(this, item)}>
                  <img className="v-image" src="https://bulma.io/images/placeholders/256x256.png" />
                  <div className="v-image-label">
                    {item.id}
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

function mapStateToProps(state) {
  const { series, product } = state
  return {
    series,
    product,
  }
}

export default connect(mapStateToProps)(Block)