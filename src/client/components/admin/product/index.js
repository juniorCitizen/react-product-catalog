import React from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import Series from '../../product/series'
import Form from './form'
import ChangeSeries from './series'
import Tags from './tags'
import Confirm from '../../../containers/modal/confirm'
import config from '../../../config'
import { updateProducts, updateSeries } from '../../../actions'

class Product extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      list: [
        {
          code: 'P00001',
          name: 'Practical Rubber Hat',
          specification: 'specification ...',
          description: 'description ...',
          active: 1,
          seriesId: '09D57C07-6839-41E1-B7E9-A41D675C4603'
        }
      ],
      page: 1,
      sItem: {},
      search: '',
      addShow: false,
      editShow: false,
      deleteShow: false,
      seriesShow: false,
      tagsShow: false,
      loading: false,
    }
  }

  componentDidMount () {

  }

  showAdd() {
    this.setState({
      addShow: true,
      sItem: {}
    })
  }

  showEdit(item) {
    console.log(item)
    this.setState({
      editShow: true,
      sItem: item
    })
  }

  showDelete(item) {
    this.setState({
      deleteShow: true,
      sItem: item
    })
  }

  showSeries(item) {
    this.setState({
      seriesShow: true,
      sItem: item,
    })
  }

  showTags(item){
    this.setState({
      tagsShow: true,
      sItem: item,
    })
  }

  hideAdd() {
    this.setState({
      addShow: false,
      sItem: {}
    })
  }

  hideEdit() {
    this.setState({
      editShow: false,
      sItem: {}
    })
  }

  hideDelete() {
    this.setState({
      deleteShow: false,
      sItem: {}
    })
  }

  hideSeries() {
    this.setState({
      seriesShow: false,
      sItem: {},
    })
  }

  hideTags() {
    this.setState({
      tagsShow: false,
      sItem: {},
    })
  }

  getSeries() {
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

  searchChange(e) {
    let val = e.target.value
    this.setState({ search: val })
  }

  deleteData() {
    const item = this.state.sItem
    const self = this
    this.setState({loading: true})
    axios({
      method: 'delete',
      url: config.route.products.delete + item.id,
      data: null,
      headers: {
        'x-access-token': window.localStorage["jwt-admin-token"],
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    })
    .then(function (response) {
      console.log(response.data)
      if (response.status === 200) {
        self.getSeries()
        self.hideDelete()
        self.setState({loading: false})
      } else {
        self.setState({loading: false})
      }
    }).catch(function (error) {
      console.log(error)
      self.setState({loading: false})
    })
  }

  removeProducts(item) {
    const { product } = this.props
    let newProducts = product.products
    for (let i = 0; i < newProducts.length; i++) {
      if (newProducts[i].id === item.id) {
        newProducts.splice(i, 1)
      }
    }
    const { dispatch } = this.props
    dispatch(update_products(newProducts))
    this.hideDelete()
  }

  doSearch() {
    return null
  }

  render() {
    const { product } = this.props
    const { list, search, addShow, editShow, deleteShow, seriesShow, tagsShow, sItem, loading } = this.state
    return (
      <div>
        <div className="container" style={style.container}>
          <div className="columns">
              <div className="column is-one-fifth">
                  <Series />
              </div>
              <div className="column">
              <nav className="level" style={style.level}>
                <div className="level-left">
                  <div className="level-item">
                  </div>
                </div>
                <div className="level-right">
                  <div className="level-item">
                    <div className="" style={style.toolBar}>
                      <div className="field has-addons">
                        <button className="button" style={style.tableButton} onClick={this.showAdd.bind(this)}>
                          <span className="icon has-text-info">
                            <i className="fa fa-plus fa-lg"></i>
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </nav>
                <table className="table is-bordered is-striped is-narrow is-fullwidth">
                  <thead>
                    <tr>
                      <th>產品圖片</th>
                      <th>產品代號</th>
                      <th>品名</th>
                      <th width="144"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {product.products.map((item, index) => (
                      <tr key={index}>
                        <td>
                          <figure className="image is-48x48">
                            <img src={config.route.photos.getPhoto + item.photos[0].id}/>
                          </figure>
                        </td>
                        <td>{item.code}</td>
                        <td>{item.name}</td>
                        <td>
                          <button className="button" style={style.tableButton} onClick={this.showTags.bind(this, item)}>
                            <span className="icon has-text-info">
                              <i className="fa fa-flag fa-fa"></i>
                            </span>
                          </button>
                          <button className="button" style={style.tableButton} onClick={this.showEdit.bind(this, item)}>
                            <span className="icon has-text-info">
                              <i className="fa fa-edit fa-lg"></i>
                            </span>
                          </button>
                          <button className="button" style={style.tableButton} onClick={this.showDelete.bind(this, item)}>
                            <span className="icon has-text-danger">
                              <i className="fa fa-trash fa-lg"></i>
                            </span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>  
                {addShow &&
                  <Form show={addShow} title="新增資料" type="add"
                    click_cancel={this.hideAdd.bind(this)}
                  />
                }
                {editShow &&
                  <Form show={editShow} title="修改資料" type="edit"
                    click_cancel={this.hideEdit.bind(this)}
                    item={sItem}
                  />
                }
                {deleteShow &&
                  <Confirm show={deleteShow} message="你確定要刪除資料？"
                    loading={loading}
                    click_ok={this.deleteData.bind(this)}
                    click_cancel={this.hideDelete.bind(this)}
                  />
                }  
                {seriesShow && 
                  <ChangeSeries show={seriesShow} title="變更類別"
                    click_cancel={this.hideSeries.bind(this)}
                    item={sItem}
                  />
                }
                {tagsShow && 
                  <Tags show={tagsShow} title="編輯標籤"
                    click_cancel={this.hideTags.bind(this)}
                    item={sItem}
                  />
                }
              </div>
          </div>
        </div>
      </div>
    )
  }
}

const style = {
  level: {
    margin: '0px',
    padding: '0px'
  },
  box: {
    marginTop: '10px'
  },
  tableButton: {
    margin: '0px 3px 0 3px'
  },
  toolBar: {
    margin: '0px 0px 10px 0px'
  },
  container: {
    padding: '10px'
  },
}

function seache() {
  return (
    <div className="" style={style.toolBar}>
      <div className="field has-addons">
        <div className="control">
          <input className="input" type="text" placeholder="輸入搜尋值"
            value={search}
            onChange={this.searchChange.bind(this)} />
        </div>
        <div className="control">
          <button className="button" onClick={this.doSearch.bind(this)}>
            <span className="icon has-text-info">
              <i className="fa fa-search fa-lg"></i>
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}

function mapStateToProps(state) {
  const { product, series } = state
  return {
    product,
    series,
  }
}

export default connect(mapStateToProps)(Product)
