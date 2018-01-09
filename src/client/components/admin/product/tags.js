import React from 'react'
import axios from 'axios'
import qs from 'qs'
import config from '../../../config'
import { update_products } from '../../../actions'

export default class Tags extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      form: {},
      msg: {
        name: '',
        specification: '',
        description: '',
        name: '',
      },
      series: [],
      tags: [],
      processing: false,
    }
  }

  componentDidMount() {
    this.setState({ form: this.props.item })
    this.getSeries()
    this.getTags()
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

  getTags() {
    const self = this
    axios({
      method: 'get',
      url: config.route.tag.getTags,
    })
    .then(function (response) {
      if (response.status === 200) {
        self.setState({tags: response.data.data})
      } else {
        console.log(response.data)
      }
    }).catch(function (error) {
      console.log(error)
    })
  }

  initSeries(list, node, n) {
    let s = '';
    for(let i = 0; i < n; i++) {
      s = s + '-'
    }
    node.map((item) => {
      item.name = s + item.name
      list.push(item)
      list = this.initSeries(list, item.childSeries, n+1)
    })
    return list
  }

  inputChange(cont, e) {
    let text = e.target.value
    let { form, msg } = this.state
    form[cont] = text
    msg[cont] = ''
    this.setState({ form: form })
    this.checkPassword()
  }

  seriesChange(e) {
    let seriesId = e.target.value
    let form = this.state.form
    form.seriesId = seriesId
    this.setState({form: form})
  }

  tagChange(e) {

  }

  doSave() {
    const { form } = this.state
    const self = this
    console.log(this.state.form)
    this.setState({processing: true})
    axios({
      method: 'put',
      url: config.route.products.update + form.id,
      data: qs.stringify(form),
      headers: {
        'x-access-token': window.localStorage["jwt-admin-token"],
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    })
    .then(function (response) {
      console.log(response.data)
      if (response.status === 200) {
        self.setState({processing: false})
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
    const isLoading = processing ? ' is-loading': ''
    return (
      <div className={"modal" + active}>
        <div className="modal-background"></div>
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">{title}</p>
          </header>
          <section className="modal-card-body">
            <div className="field">
              <label className="label">產品代號</label>
              <div className="control">
                <input className="input" type="text" placeholder="請輸入產品代號" disabled={true}
                  value={form.code || ''} onChange={this.inputChange.bind(this, 'code')}
                />
              </div>
            </div>
            <div className="field">
              <label className="label">品名</label>
              <div className="control">
                <input className="input" type="text" placeholder="請輸入品名"
                  value={form.name || ''} onChange={this.inputChange.bind(this, 'name')}
                />
              </div>
              <p className="help is-danger">{msg.name}</p>
            </div>
            <div className="field">
              <label className="label">規格</label>
              <div className="control">
                <textarea className="textarea" placeholder="請輸入規格"
                  value={form.specification || ''}
                  onChange={this.inputChange.bind(this, 'specification')}/>
              </div>
              <p className="help is-danger">{msg.specification}</p>
            </div>
            <div className="field">
              <label className="label">說明</label>
              <div className="control">
                <textarea className="textarea" placeholder="請輸入說明"
                  value={form.description || ''}
                  onChange={this.inputChange.bind(this, 'description')}/>
              </div>
              <p className="help is-danger">{msg.description}</p>
            </div>
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
            <div className="field">
              <label className="label">標籤</label>
              <div className="control">
                <div className="select is-multiple">
                  <select multiple onChange={this.tagChange.bind(this)} value={form.seriesId}>
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
            <div className="field">
              <label className="label">產品圖片</label>
                <div className="file has-name is-fullwidth">
                  <label className="file-label">
                    <input className="file-input" type="file" name="resume"/>
                    <span className="file-cta">
                      <span className="file-icon">
                        <i className="fa fa-upload"></i>
                      </span>
                      <span className="file-label">
                        Choose a file…
                      </span>
                    </span>
                    <span className="file-name">
                      ...
                    </span>
                  </label>
                </div>
              <p className="help is-danger">{msg.photo}</p>
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