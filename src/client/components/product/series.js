import React from 'react'
import axios from 'axios'
import { set_series_code, series_patch, update_products } from '../../actions'
import { connect } from 'react-redux'
import config from '../../config'

class Series extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      alertShow: false,
      alertMsg: '',
    }
  }

  componentDidMount() {
    this.getSeries()
  }

  componentWillUnmount() {
    const { dispatch } = this.props
    dispatch(update_products([]))
  }

  selectSeries(id) {
    const { dispatch } = this.props
    dispatch(set_series_code(id))
    let { series } = this.props.series
    series = this.setSeriesActive(series, id)
    dispatch(series_patch(series))
  }

  setSeriesActive(series, id) {
    let self = this
    series && series.map((item) => {
      item.selected = item.id === id
      if (item.selected) {
        this.updateProducts(item.products)
      }
      item.childSeries && item.childSeries.map((sub) => {
        if (sub.id === id) {
          item.selected = true
          this.updateProducts(sub.products)
        }
      })
      item.childSeries = this.setSeriesActive(item.childSeries, id)
    })
    return series
  }

  updateProducts(list) {
    const { dispatch } = this.props
    dispatch(update_products(list))
  }

  getSeries() {
    const self = this
    axios({
      method: 'get',
      url: config.route.productMenu,
      data: {},
      headers: {}
    })
    .then(function (response) {
      if (response.status === 200) {
        self.setSeries(response.data.data)
      } else {
        console.log(response.data)
      }
    }).catch(function (error) {
      console.log(error)
    })
  }

  setSeries(series) {
    const { dispatch } = this.props
    dispatch(series_patch(series))
  }

  render() {
    const { alertShow, alertMsg } = this.state
    const { series } = this.props.series
    return (
      <div>
        <aside className="menu">
          <ul className="menu-list">
            {series.map((item, index) => (
              <li key={index}>
                <a className={item.selected ? "is-active" : ""} onClick={this.selectSeries.bind(this, item.id)}>{item.name}</a>
                {item.childSeries && item.selected &&
                  <ul>
                    {item.childSeries.map((item, index) => (
                      <li key={index}>
                        <a className={item.selected ? "is-active" : ""}
                          onClick={this.selectSeries.bind(this, item.id)}
                        >
                          {item.name}</a>
                      </li>
                    ))}
                  </ul>
                }
              </li>
            ))}
          </ul>
        </aside>
      </div>
    )
  }
}

function mapStateToProps(state) {
  const { series } = state
  return {
    series
  }
}

export default connect(mapStateToProps)(Series)