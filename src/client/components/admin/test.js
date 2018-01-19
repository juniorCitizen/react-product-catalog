import React from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { test } from '../../lib'
import config from '../../config'

class Test extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      
    }
  }
  
  componentDidMount() {
    axios({
      method: 'get',
      url: config.route.series.list,
    })
    .then(function (response) {
      console.log(response.data)
      if (response.status === 200) {
  
      } else {
        console.log(response)
      }
    }).catch(function (error) {
      console.log(error)
    })
  }


  render() {

    return (
      <div>
        test
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

export default connect(mapStateToProps)(Test)