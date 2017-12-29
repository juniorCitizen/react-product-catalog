import React from 'react'

export default class Alert extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      btn_ok: {
        text: '確定',
        type: 'is-danger',
      },
      icon: 'fa-times-circle',
      iconType: 'danger',
    }
  }

  render() {
    const { message, click_ok, click_cancel } = this.props
    const btn_ok = this.props.btn_ok || this.state.btn_ok
    const btn_cancel = this.props.btn_cancel || this.state.btn_cancel
    const icon = this.props.icon || this.state.icon
    const iconType = this.props.iconType || this.state.iconType
    const show = this.props.show ? ' is-active' : ''
    return (
      <div className={"modal" + show}>
        <div className="modal-background"></div>
        <div className="modal-card modal-alert">
          <header className="modal-card-head">
            <p className="modal-card-title">
              <span className={"icon is-medium has-text-" + iconType}>
                <i className={"fa fa-2x " + icon}></i>
              </span>
            </p>
          </header>
          <section className="modal-card-body">

            <h2 className="title is-2">{message}</h2>
          </section>
          <footer className="modal-card-foot">
            <button className={"button " + btn_ok.type} onClick={click_ok}>
              {btn_ok.text}
            </button>
          </footer>
        </div>
      </div>
    )
  }
}