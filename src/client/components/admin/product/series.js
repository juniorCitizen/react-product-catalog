import React from 'react'
import axios from 'axios'
import qs from 'qs'
import config from '../../../config'
import { connect } from 'react-redux'
import { series_patch, update_products } from '../../../actions'

class Series extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      form: {},
      list: [],
      tags: [],
      processing: false,
    }
  }

  componentDidMount() {
    this.setState({ 
      form: this.props.item, 
    })
    this.getSeries()
  }

  getSeries() {
    let { series } = this.props.series
    let list  = this.initSeries([], series, 0)
    this.setState({list: list})
  }

  initSeries(list, node, n) {
    let s = '';
    for (let i = 0; i < n; i++) {
      s = s + '-'
    }
    node.map((item) => {
      item.newName = s + item.name
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
    this.setState({ processing: true })
    axios({
      method: 'patch',
      url: config.route.products.patch + form.id + '?seriesId=' + seriesId,
      headers: {
        'x-access-token': window.localStorage["jwt-admin-token"],
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    })
    .then(function (response) {
      console.log(response.data)
      if (response.status === 200) {
        self.resetSeries()
        self.setState({ processing: false })
        self.props.click_cancel()
      } else {
        console.log(response)
      }
    }).catch(function (error) {
      console.log(error)
    })
  }

  resetSeries() {
    let { series } = this.props.series
    const { dispatch } = this.props
    let newSeries = this.modifySeries(series)
    dispatch(series_patch(newSeries))
  }

  modifySeries(list) {
    let { form } = this.state
    for (let m = 0; m < list.length; m++) {
      for (let i = 0; i < list[m].products.length; i++) {
        if (list[m].products[i].seriesId !== list[m].id) {
          list[m].products.splice(i, 1)
        }
      }
      if (list[m].id === form.seriesId) {
        list[m].products.push(form)
      }
      let childSeries = this.modifySeries(list[m].childSeries)
      list[m].childSeries = childSeries
    }
    return list
  }

  render() {
    const { title, show, click_cancel } = this.props
    const { form, msg, processing, list, tags } = this.state
    const active = show ? ' is-active' : ''
    const isLoading = processing ? ' is-loading' : ''
    console.log(this.props.series.series)
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
                    {list.map((item, index) => (
                      <option
                        key={index}
                        value={item.id}
                      >
                        {item.newName}
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

function mapStateToProps(state) {
  const { series } = state
  return {
    series
  }
}

export default connect(mapStateToProps)(Series)