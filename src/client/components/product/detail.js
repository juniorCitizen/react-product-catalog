import React from 'react'
import axios from 'axios'
import config from '../../config'
import { connect } from 'react-redux'
import { update_order, add_order, remove_order } from '../../actions'

class Detail extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: null,
    }
  }

  componentDidMount() {
    const { info } = this.props
    //this.getProductInfo(info.id)
  }

  getProductInfo(id) {
    const self = this
    axios({
      method: 'get',
      url: config.route.products.detail + id,
      data: {},
      headers: {
        'x-access-token': window.localStorage["jwt-token"]
      }
    })
      .then(function (response) {
        if (response.status === 200) {
          let data = response.data.data
          data.ordered = false
          self.setState({
            data: response.data.data
          })
          self.checkOrder()
        } else {
          console.log(response.data)
        }
      }).catch(function (error) {
        console.log(error)
      })
  }

  checkOrder() {
    let { data } = this.state
    const { order } = this.props.order
    order.map((item, index) => {
      if (item.id === data.id) {
        data.ordered = true
        this.setState({ data: data })
      }
    })
  }

  addOrder() {
    const { dispatch } = this.props
    const { data } = this.state
    data.ordered = true
    this.setState({ data: data })
    dispatch(add_order(this.state.data))
  }

  removeOrder() {
    const { data } = this.state
    const { dispatch } = this.props
    data.ordered = false
    this.setState({ data: data })
    dispatch(remove_order(data.id))
  }

  doClear() {
    this.setState({ data: null })
  }

  render() {
    const { order } = this.props
    const { data } = this.state
    const show = this.props.show ? ' is-active' : ''
    return (
      <div className={"modal" + show}>
        <div className="modal-background" onClick={this.props.hide}></div>
        <div className="modal-large">
          <div className="columns" style={style.columns}>
            <div className="column is-two-fifths" style={style.column}>
              <figure>
                {data && <img style={style.image} src={config.route.photos.getPhoto + data.photos[0].id} />}
              </figure>
              {data && data.ordered === false ?
                <button className="button is-orange" onClick={this.addOrder.bind(this)}>加入詢價清單</button>
                :
                <button className="button is-bg-dange" onClick={this.removeOrder.bind(this)}>取消詢價</button>
              }
            </div>
            <div className="column" style={{ overlfow: 'scroll' }}>
              {data &&
                <div className="content">
                  <h2>{data.name}</h2>
                  {data.tags.map((item, index) => (
                    <span key={index} className="tag is-info" style={style.tags}>{item.name}</span>
                  ))}
                  <h3>產品規格</h3>
                  <p>{data.specification}</p>
                  <h3>產品介紹</h3>
                  <p>{data.description}</p>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const style = {
  columns: {
    margin: '0px',
  },
  column: {
    padding: '5px',
  },
  tags: {
    marginRight: '5px',
  },
  image: {
    margin: '0 auto',
    width: '300px',
  }
}

function mapStateToProps(state) {
  const { order } = state
  return {
    order,
  }
}

export default connect(mapStateToProps, null, null, { withRef: true })(Detail)