import React from 'react'
import axios from 'axios'
import qs from 'qs'
import config from '../../../config'
import { connect } from 'react-redux'
import { updateSeries, updateProducts } from '../../../actions'

class Form extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      form: {
        code: '',
        name: '',
        specification: '',
        description: '',
        seriesId: '',
        photos: [],
      },
      files: [{
        name: '...',
        thumb: null,
      }],
      msg: {
        name: '',
        specification: '',
        description: '',
        name: '',
        photo: '',
      },
      series: [],
      tags: [],
      processing: false,
    }
  }

  componentDidMount() {
    let item = this.props.item? this.props.item: this.state.form
    this.setState({ form: item })
    this.getSeries(item)
    //this.getTags()
  }

  getSeries(item) {
    let { series } = this.props.series
    let list = this.initSeries([], series, 0)
    if (item.seriesId === '') {
      item.seriesId = list[0].id
      this.setState({ form: item })
    }
    this.setState({ series: list })
  }

  resetSeries() {
    const self = this
    const { dispatch } = this.props
    const { selectedId } = this.props.series
    axios({
      method: 'get',
      url: config.route.series.list,
    })
    .then(function (response) {
      if (response.status === 200) {
        let series = self.setSeriesActive(response.data.data, selectedId)
        console.log(series)
        dispatch(updateSeries(series))
      } else {
        console.log(response.data)
      }
    }).catch(function (error) {
      console.log(error)
    })
  }

  setSeriesActive(series, id) {
    let self = this
    series.map((item) => {
      if (item.id === id) {
        item.selected = true
        this.getProducts(item.id)
      } else {
        item.selected = false
      }
      if (item.childSeries !== undefined) {
        item.childSeries = this.setSeriesActive(item.childSeries, id)
        item.childSeries.map((sub) => {
          if (sub.id === id || sub.selected) {
            item.selected = true
          }
        })
      } 
    })
    return series
  }

  getProducts(id) {
    const self = this
    axios({
      method: 'get',
      url: config.route.series.products + id,
    })
    .then(function (response) {
      if (response.status === 200) {
        let series = response.data.data[0]
        console.log(series.products)
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
 

  seriesChange(e) {
    let seriesId = e.target.value
    let form = this.state.form
    form.seriesId = seriesId
    this.setState({ form: form})
  }

  initSeries(list, node, n) {
    let s = '';
    for (let i = 0; i < n; i++) {
      s = s + '-'
    }
    node.map((item) => {
      item.newName = s + item.name
      list.push(item)
      if (item.childSeries !== undefined) {
        list = this.initSeries(list, item.childSeries, n + 1)
      }
    })
    return list
  }

  _resetSeries() {
    let { series } = this.props.series
    const { dispatch } = this.props
    let newSeries = this.modifySeries(series)
    dispatch(updateSeries(newSeries))
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

  inputChange(cont, e) {
    let text = e.target.value
    let { form, msg } = this.state
    form[cont] = text
    msg[cont] = ''
    this.setState({ form: form })
  }

  doSave() {
    this.saveProductInfo()
  }

  insertPhoto() {
    const { form, files } = this.state
    const self = this
    this.setState({processing: true})
    var formData = new FormData()
    formData.append('productId', form.id)
    formData.append('photo', files[0])
    if (files[0].thumb) {
      axios({
        method: 'post',
        url: config.route.photos.primary,
        data: formData,
        headers: {
          'x-access-token': window.localStorage["jwt-admin-token"],
          'Content-Type': 'multipart/form-data',
        }
      })
      .then(function (response) {
        if (response.status === 200) {
          console.log(response.data.data)
          self.setState({processing: false})
          self.props.click_cancel()
          //self.mergeProductPhoto(response.data.data[0])
        } else {
          console.log(response)
        }
      }).catch(function (error) {
        console.log(error)
      })
    } else {
      console.log('photo no change')
      self.setState({ processing: false })
      self.props.click_cancel()
    }
  }

  mergeProductPhoto(photoId) {
    const { form } = this.state
    const self = this
    axios({
      method: 'patch',
      url: config.route.photos.primary + photoId + '/products/' + form.id,
      data: qs.stringify(form),
      headers: {
        'x-access-token': window.localStorage["jwt-admin-token"],
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    })
    .then(function (response) {
      if (response.status === 200) {
        console.log(response.data.data)
        let form = self.state.form
        let photos = {id: photoId}
        form.photos.push(photos)
        self.setState({ 
          processing: false,
          form: form,
        })
        self.resetSeries()
        self.props.click_cancel()
      } else {
        console.log(response)
      }
    }).catch(function (error) {
      console.log(error)
    })
  }

  saveProductInfo() {
    const { form } = this.state
    const self = this
    let method
    let apiUrl
    this.setState({processing: true})
    if (this.props.type === 'add') {
      method = 'post'
      apiUrl = config.route.products.insert
    } else {
      method = 'put'
      apiUrl = config.route.products.update + form.id
    }
    delete form.tags
    axios({
      method: method,
      url: apiUrl,
      data: qs.stringify(form),
      headers: {
        'x-access-token': window.localStorage["jwt-admin-token"],
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    })
    .then(function (response) { 
      if (response.status === 200) {
        console.log(response.data.data)
        self.setState({
          processing: false,
          form: response.data.data,
        })
        self.resetSeries()
        self.insertPhoto()
      } else {
        console.log(response)
      }
    }).catch(function (error) {
      console.log(error)
    })
  }

  handlePhoto(e) {
    let files = e.target.files
    if (files.length < 1) {
      return
    }
    if (files[0].type.substr(0, 5) !== 'image') {
      this.setState({msg: {photo: '檔案非圖片格式'}})
      return 
    }
    files[0].thumb = window.URL.createObjectURL(files[0])
    files = Array.prototype.slice.call(files, 0)
    // 过滤非图片类型的文件
    
    files = files.filter(function (file) {
      return /image/i.test(file.type)
    })
    this.setState({files: files, msg: {photo: ''}})
    console.log(files)
  }

  render() {
    const { title, show, click_cancel } = this.props
    const { form, msg, processing, series, tags, files } = this.state
    const active = show ? ' is-active' : ''
    const isLoading = processing ? ' is-loading': ''
    const preView = form.photos.length > 0? config.route.photos.getPhoto + form.photos[0].id: ''
    const photo = files[0].thumb? files[0].thumb: preView
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
                <input className="input" type="text" placeholder="請輸入產品代號"
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
                        {item.newName}
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
                    <input className="file-input" type="file" onChange={(e) => this.handlePhoto(e)}/>
                    <span className="file-cta">
                      <span className="file-icon">
                        <i className="fa fa-upload"></i>
                      </span>
                      <span className="file-label">
                        選擇檔案
                      </span>
                    </span>
                    <span className="file-name">
                      {files[0].name}
                    </span>
                  </label>
                </div>
              <p className="help is-danger">{msg.photo}</p>
              {photo && 
                <figure className="image is-128x128">
                  <img src={photo} />
                </figure>
              }
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

export default connect(mapStateToProps)(Form)