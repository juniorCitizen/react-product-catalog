import React from 'react'
import axios from 'axios'

export default class Form extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      form: {},
      msg: {
        email: '',
        password: '',
        confirm: '',
        name: '',
        address: '',
        telephone: '',
        submit: '',
      },
    }
  }

  componentDidMount() {
    this.setState({ form: this.props.item })
  }

  inputChange(cont, e) {
    let text = e.target.value
    let { form, msg } = this.state
    form[cont] = text
    msg[cont] = ''
    this.setState({ form: form })
    this.checkPassword()
  }

  checkPassword() {
    let { form, msg } = this.state
    if (form.password !== form.confirm) {
      msg.confirm = '密碼與確認密碼不一致'
      this.setState({ msg: msg })
      return
    }
    this.setState({ msg: msg })
  }

  checkedChange(e) {
    const val = e.target.value
    let form = this.state.form
    form.admin = val
    this.setState({ form: form })
  }

  doSave() {
    console.log(this.state.form)
    return
    axios({
      method: 'post',
      url: '',
      data: null,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    })
      .then(function (response) {
        console.log(response.data)
        if (response.status === 200) {

        } else {

        }
      }).catch(function (error) {
        console.log(error)
      })
  }

  render() {
    const { title, show, click_cancel } = this.props
    const { form, msg } = this.state
    const active = show ? ' is-active' : ''
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
              <p className="help is-danger">{msg.email}</p>
            </div>
            <div className="field">
              <label className="label">品名</label>
              <div className="control">
                <input className="input" type="text" placeholder="請輸入品名"
                  value={form.name || ''} onChange={this.inputChange.bind(this, 'name')}
                />
              </div>
              <p className="help is-danger">{msg.password}</p>
            </div>
            <div className="field">
              <label className="label">規格</label>
              <div className="control">
                <input className="input" type="text" placeholder="請輸入規格"
                  value={form.specification || ''} onChange={this.inputChange.bind(this, 'specification')}
                />
              </div>
              <p className="help is-danger">{msg.confirm}</p>
            </div>
            <div className="field">
              <label className="label">說明</label>
              <div className="control">
                <input className="input" type="text" placeholder="請輸入說明"
                  value={form.description || ''} onChange={this.inputChange.bind(this, 'description')}
                />
              </div>
              <p className="help is-danger">{msg.description}</p>
            </div>
            <div className="field">
              <label className="label">產品圖片</label>
                <div class="file has-name is-fullwidth">
                  <label class="file-label">
                    <input class="file-input" type="file" name="resume"/>
                    <span class="file-cta">
                      <span class="file-icon">
                        <i class="fa fa-upload"></i>
                      </span>
                      <span class="file-label">
                        Choose a file…
                      </span>
                    </span>
                    <span class="file-name">
                      Screen Shot 2017-07-29 at 15.54.25.png
                    </span>
                  </label>
                </div>
              <p className="help is-danger">{msg.address}</p>
            </div>
            <div className="field">
              <label className="label">啟用</label>
              <div className="control">
                <label className="radio">
                  <input type="radio" name="is-active"
                    value="true" checked={form.active === "true"} onChange={this.checkedChange.bind(this)} />
                  {'Yes'}
                </label>
                <label className="radio">
                  <input type="radio" name="is-active"
                    value="false" checked={form.active || 'false' === "false"} onChange={this.checkedChange.bind(this)} />
                  {'No'}
                </label>
              </div>
            </div>
          </section>
          <footer className="modal-card-foot">
            <button className="button is-success" onClick={this.doSave.bind(this)}>儲存</button>
            <button className="button" onClick={click_cancel}>取消</button>
          </footer>
        </div>
      </div>
    )
  }
}