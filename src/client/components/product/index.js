import React from 'react'
import { connect } from 'react-redux'
import Nav from '../navigation'
import Series from './series'
import Block from './block'

class Product extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    console.log(window)
    return (
      <div>
        <Nav tab="product" />
        <div className="container" style={style.container}>
          <div className="columns" style={{height: 'auto'}}>
            <div className="column is-one-fifth" style={style.series}>
              <Series />
            </div>
            <div className="column" style={style.block}>
              <Block history={this.props.history} />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const style = {
  container: {
    padding: '10px',
  },
  series: {
    height: '100%',
  },
  block: {
    height:  window.visualViewport.height - 163, 
    overflowY: 'auto',
  },
}

function mapStateToProps(state) {
  const { login } = state
  return {
    login
  }
}

export default connect(mapStateToProps)(Product)