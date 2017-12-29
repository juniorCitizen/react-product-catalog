import React from 'react'
import config from '../../config'

export default class Logo extends React.Component {
  render() {
    return (
      <section className="hero is-light">
        <div className="hero-head">
          <div className="container">
            <div className="" style={style.box}>
              <h1 className="title">
                This is LOGO!!!
              </h1>
            </div>
          </div>
        </div>
      </section>

    )
  }
}

const style = {
  box: {
    height: '80px',
    marginTop: '10px',
    marginBottom: '12px',
  },
}