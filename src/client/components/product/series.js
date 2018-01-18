import React from 'react'
import axios from 'axios'
import { selectedSeriesId, updateSeries, updateProducts } from '../../actions'
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
    dispatch(updateProducts([]))
  }

  selectSeries(id) {
    const { dispatch } = this.props
    let { series } = this.props.series
    dispatch(selectedSeriesId(id))
    series = this.setSeriesActive(series, id)
    dispatch(updateSeries(series))
  }

  setSeriesActive(series, id) {
    let self = this
    series.map((item) => {
      if (item.id === id) {
        item.selected = true
        this.getProducts(item.id)
      } else {
        if (item.childSeries !== undefined) {
          item.childSeries = this.setSeriesActive(item.childSeries, id)
        }
      }
    })
    return series
  }

  getProducts(id) {
    const self = this
    console.log('get products')
    axios({
      method: 'get',
      url: config.route.series.products + id,
    })
    .then(function (response) {
      if (response.status === 200) {
        let series = response.data.data[0]
        self.updateProducts(series.products)
      } else {
        console.log(response.data)
      }
    }).catch(function (error) {
      console.log(error)
    })
  }

  updateProducts(list) {
    const { dispatch } = this.props
    dispatch(updateProducts(list))
  }

  getSeries() {
    const self = this
    axios({
      method: 'get',
      url: config.route.series.list,
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
    dispatch(updateSeries(series))
  }

  render() {
    const { alertShow, alertMsg } = this.state
    const { series, selectedId } = this.props.series
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