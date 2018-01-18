import React from 'react'
import axios from 'axios'
import { seriesSelected, seriesUpdate, update_products } from '../../actions'
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
    //this.getSeries()
  }

  componentWillUnmount() {
    const { dispatch } = this.props
    dispatch(update_products([]))
  }

  selectSeries(id) {
    const { dispatch } = this.props
    dispatch(seriesSelected(id))
    let { series } = this.props.series
    series = this.setSeriesActive(series, id)
    dispatch(seriesUpdate(series))
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

  activeSeries(series, selected) {
    let active = false
    if (series.length > 0) {
      series.map((item) => {
        if (item.id === selected) {
          active = true
          item.selected = active
        }
        if (!active && item.childSeries.length > 0) {
          active = this.activeSeries(item.childSeries, selected)
          item.selected = active
        }
      })
      return active
    }
  }

  setProducts(series, selected) {
    const { dispatch } = this.props
    for (let i = 0; i < series.length; i++) {
      if (series[i].id = selected) {
        dispatch(update_products(series[i].products))
      } else {
        if (series[i].childSeries.length > 0) {
          this.setProducts(series[i].childSeries)
        }
      }
    }
  }

  getSeries() {
    const self = this
    axios({
      method: 'get',
      url: config.route.series.list,
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
    dispatch(seriesUpdate(series))
  }

  render() {
    const { alertShow, alertMsg } = this.state
    const { series, selected } = this.props.series
    this.activeSeries(series, selected)
    return (
      <div>
        <aside className="menu">
          <ul className="menu-list">
            {series.map((item, index) => (
              <li key={index}>
                <a className={item.selected ? "is-active" : ""} onClick={this.selectSeries.bind(this, item.id)}>{item.name}</a>
                {item.hasOwnProperty('childSeries') && item.selected &&
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