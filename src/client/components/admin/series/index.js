import React from 'react'
import axios from 'axios'
import qs from 'qs'
import SortableTree from 'react-sortable-tree'
import config from '../../../config'

export default class Series extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      list: [],
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
          series: list
        })
      } else {
        console.log(response.data)
      }
    }).catch(function (error) {
      console.log(error)
    })
  }
  

  render() {
    const { series } = this.state
    console.log(series)
    return (
      <div>
        <div className="container" style={style.container}>
          <div style={{ height: 700 }}>
            {series && 
              <SortableTree
                treeData={series}
                onChange={series => this.setState({ series })}
                maxDepth={2}
              />
            }
          </div>
        </div>
      </div>
    )
  }
}

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