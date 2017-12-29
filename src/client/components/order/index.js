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
    const { dispatch } = this.props
    dispatch(remove_order(id))
  }

  sendOrder() {
    const { login, order } = this.props
    const auth = login.user_info.auth
    let form = {comments}
    for (let i = 0; i < order.length; i++) {
      form['productidlist['+i+']'] = order[i].id
      form['quantities['+i+']'] = 1
    }
    if (auth) {
      axios({
        method: 'post',
        url: config.route.contacts.register,
        data: qs.stringify(form),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      })
      .then(function (response) {
        console.log(response.data)
        if (response.status === 200) {
          window.localStorage["jwt-token"] = response.data.data
          self.cleanOrder()
          self.submitSuccess()
        } else {
          self.submitError(res.msg)
        }
      }).catch(function (error) {
        console.log(error)
      })
    } else {
      this.props.history.push(config.sys_ref + "/register");
    }
  }



  render() { 
    const { order } = this.props
    const { list } = this.state
    const inquiry = order.order.length > 0 ? true: false
    return (
      <div>
        <Nav tab="order" />
        <div className="container" style={style.container}>
          {inquiry ?
            <div style={{position: 'relative'}}>
              <button className="button is-orange" style={style.post} onClick={this.sendOrder.bind(this)}>送出詢價單</button>
              <table className="table is-bordered is-striped is-narrow is-fullwidth" style={style.orders}>
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
            </div>
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
  },
  post: {
    marginBottom: '10px',
    position: 'absolute', 
    right: '0px',
  },
  orders: {
    position: 'absolute', 
    top: '46px',
  }
}

function mapStateToProps(state) {
  const { login, order } = state
  return {
    login,
    order,
  }
}

export default connect(mapStateToProps, null, null, { withRef: true })(Order)