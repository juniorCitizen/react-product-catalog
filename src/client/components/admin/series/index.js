import React from 'react'
import axios from 'axios'
import qs from 'qs'
import SortableTree, { addNodeUnderParent, removeNodeAtPath } from 'react-sortable-tree'
import config from '../../../config'
import Prompt from '../../../containers/modal/prompt'

export default class Series extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      treeData: [],
      addNewShow: false,
      addChildShow: false,
      addSeriesShow: false,
      node: '',
      path: '',
      newNode: '',
    }
  }

  componentDidMount() {
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
        let list = initList(response.data.data)
        self.setState({
          treeData: list
        })
      } else {
        console.log(response.data)
      }
    }).catch(function (error) {
      console.log(error)
    })
  }

  valueChange(name) {
    this.setState({ newNode: name })
  }

  addChildCancel() {
    this.setState({ addChildShow: false })
  }

  addNewCancel() {
    this.setState({ addNewShow: false })
  }
  
  addChild() {
    const self = this
    const { node, path, newNode } = this.state
    let data = { name: newNode }
    axios({
      method: 'post',
      url: config.route.series.insert + node.id,
      data: qs.stringify(data),
      headers: {
        'x-access-token': window.localStorage["jwt-admin-token"],
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    })
    .then(function (response) {
      if (response.status === 200) {
        console.log(response)
        self.setState(state => ({
          treeData: addNodeUnderParent({
            treeData: state.treeData,
            parentKey: path[path.length - 1],
            expandParent: true,
            getNodeKey,
            newNode: initNode(response.data.data),
          }).treeData,
          addChildShow: false,
        }))
      } else {
        console.log(response)
      }
    }).catch(function (error) {
      console.log(error)
    })
  }

  removeNode(node, path) {
    this.setState(state => ({
      treeData: removeNodeAtPath({
        treeData: state.treeData,
        path,
        getNodeKey,
      }),
    }))
    axios({
      method: 'delete',
      url: config.route.series.delete + node.id,
      headers: {
        'x-access-token': window.localStorage["jwt-admin-token"],
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    })
    .then(function (response) {
      if (response.status === 200) {
        console.log(response)
      } else {
        console.log(response)
      }
    }).catch(function (error) {
      console.log(error)
    })
  }

  addNew() {
    this.setState({ addNewShow: true })
  }

  addNewNode() {
    let self = this
    let data = { name: this.state.newNode }
    axios({
      method: 'post',
      url: config.route.series.add,
      data: qs.stringify(data),
      headers: {
        'x-access-token': window.localStorage["jwt-admin-token"],
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    })
    .then(function (response) {
      if (response.status === 200) {
        console.log(response.data.data)
        let data = initNode(response.data.data)
        self.setState(state => ({
          treeData: state.treeData.concat(data),
          addNewShow: false,
        }))
      } else {
        console.log(response)
      }
    }).catch(function (error) {
      console.log(error)
    })
  }


  render() {
    const { treeData, addNewShow, addChildShow } = this.state
    return (
      <div>
        <div className="container" style={style.container}>
          <button className="button" onClick={this.addNew.bind(this)}>
            <span className="icon has-text-info">
              <i className="fa fa-plus"></i>
            </span>
            <span>新增分類</span>
          </button>
          <div style={{ height: 700 }}>
            {treeData && 
              <SortableTree
                treeData={treeData}
                onChange={treeData => this.setState({ treeData })}
                maxDepth={2}
                generateNodeProps={({ node, path }) => ({
                  buttons: [
                    node.menuLevel === 0 ?
                    <button className="button"
                      onClick={() => {
                        this.setState({
                          node: node,
                          path: path,
                          addChildShow: true,
                        })
                      }}
                    >
                      <span className="icon has-text-info">
                        <i className="fa fa-plus"></i>
                      </span>
                    </button> : null,
                    node.products.length > 0 || node.childSeries.length > 0 ? null: 
                    <button className="button"
                      onClick={() =>
                        this.removeNode(node, path)
                      }
                    >
                      <span className="icon has-text-danger">
                        <i className="fa fa-trash-alt fa-lg"></i>
                      </span>
                    </button>,
                  ],
                })}

              />
            }
          </div>
        </div>
        {addChildShow && 
          <Prompt show={addChildShow} message="請輸入新增分類名稱"
            value_change={this.valueChange.bind(this)}
            click_ok={this.addChild.bind(this)}
            click_cancel={this.addChildCancel.bind(this)}
          />
        }
        {addNewShow && 
          <Prompt show={addNewShow} message="請輸入新增分類名稱"
            value_change={this.valueChange.bind(this)}
            click_ok={this.addNewNode.bind(this)}
            click_cancel={this.addNewCancel.bind(this)}
          />
        }
      </div>
    )
  }
}
const getNodeKey = ({ treeIndex }) => treeIndex

function initList(obj) {
  return obj.map((item) => {
    return initNode(item)
  })
}

function initNode(node) {
  node.childSeries = initList(node.childSeries)
  node.title = node.name
  node.expanded = true
  node.children = node.childSeries
  return node
}

const style = {
  container: {
    padding: '10px'
  },
}