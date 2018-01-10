import React from 'react'
import axios from 'axios'
import qs from 'qs'
import config from '../../../config'
import { update_products } from '../../../actions'

export default class Series extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      form: {},
      seriesId: '',
      series: [],
      tags: [],
      processing: false,
    }
  }

  componentDidMount() {
    this.setState({ 
      form: this.props.item, 
      oldSeriesId: this.props.item.seriesId,
    })
    this.getSeries()
  }

  getSeries() {
    const self = this
    axios({
      method: 'get',
      url: config.route.productMenu,
    })
    .then(function (response) {
      if (response.status === 200) {
        let list = self.initSeries([], response.data.data, 0)
        self.setState({
          series: list
        })
      } else {
        console.log(response.data)
      }
    }).catch(function (error) {
      console.log(error)
    })
  }

  initSeries(list, node, n) {
    let s = '';
    for (let i = 0; i < n; i++) {
      s = s + '-'
    }
    node.map((item) => {
      item.name = s + item.name
      list.push(item)
      list = this.initSeries(list, item.childSeries, n + 1)
    })
    return list
  }

  seriesChange(e) {
    let seriesId = e.target.value
    let form = this.state.form
    form.seriesId = seriesId
    this.setState({ seriesId: seriesId})
  }

  doSave() {
    const { form, seriesId } = this.state
    const self = this
    console.log(this.state)
    this.setState({ processing: true })
    axios({
      method: 'patch',
      url: config.route.products.patchSeries + form.id + '?seriesId=' + seriesId,
      headers: {
        'x-access-token': window.localStorage["jwt-admin-token"],
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    })
    .then(function (response) {
      console.log(response.data)
      if (response.status === 200) {
        self.setState({ processing: false })
        self.props.click_cancel()
      } else {
        console.log(response)
      }
    }).catch(function (error) {
      console.log(error)
    })
  }

  render() {
    const { title, show, click_cancel } = this.props
    const { form, msg, processing, series, tags } = this.state
    const active = show ? ' is-active' : ''
    const isLoading = processing ? ' is-loading' : ''
    return (
      <div className={"modal" + active}>
        <div className="modal-background"></div>
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">{title}</p>
          </header>
          <section className="modal-card-body">
            <div className="field">
              <label className="label">分類</label>
              <div className="control">
                <div className="select">
                  <select onChange={this.seriesChange.bind(this)} value={form.seriesId}>
                    {series.map((item, index) => (
                      <option
                        key={index}
                        value={item.id}
                      >
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </section>
          <footer className="modal-card-foot">
            <button className={"button is-success" + isLoading} onClick={this.doSave.bind(this)}>儲存</button>
            <button className="button" onClick={click_cancel}>取消</button>
          </footer>
        </div>
      </div>
    )
  }
}