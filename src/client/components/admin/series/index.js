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
        let list = initData(response.data.data)
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
  
  addChild() {
    const { node, path, newNode } = this.state
    this.setState(state => ({
      treeData: addNodeUnderParent({
        treeData: state.treeData,
        parentKey: path[path.length - 1],
        expandParent: true,
        getNodeKey,
        newNode: {
          title: newNode,
          products: [],
          childSeries: [],
        },
      }).treeData,
      addChildShow: false,
    }))
  }


  render() {
    const { treeData, addChildShow } = this.state
    return (
      <div>
        <div className="container" style={style.container}>
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
                        this.setState(state => ({
                          treeData: removeNodeAtPath({
                            treeData: state.treeData,
                            path,
                            getNodeKey,
                          }),
                        }))
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
      </div>
    )
  }
}
const getNodeKey = ({ treeIndex }) => treeIndex

function initData(obj) {
  return obj.map((item) => {
    item.childSeries = initData(item.childSeries)
    item.title = item.name
    item.expanded = true
    item.children = item.childSeries
    return item
  })
}

const style = {
  container: {
    padding: '10px'
  },
}