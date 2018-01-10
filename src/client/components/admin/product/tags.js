import React from 'react'
import axios from 'axios'
import qs from 'qs'
import config from '../../../config'
import { connect } from 'react-redux'
import { update_products } from '../../../actions'

class Tags extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      form: {},
      selected: [],
      tags: [],
      processing: false,
    }
  }

  componentDidMount() {
    this.setState({ 
      form: this.props.item, 
    })
    this.getTags()
    this.initTags()
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

  initTags() {
    let tags = this.props.item.tags
    if (tags.length > 0) {
      let arr = []
      tags.map((item) => {
        arr.push(item.id)
      })
      this.setState({selected: arr})
    }
  }

  selectTags(e) {
    let tag = Number(e.target.value)
    let { selected } = this.state
    let add = true
    for (let i = 0; i < selected.length; i++) {
      if (selected[i] === tag) {
        selected.splice(i, 1)
        add = false
      }
    }
    if (add) {
      selected.push(tag)
    }
    this.setState({selected: selected})
  }

  doSave() {
    console.log(this.state.selected)
    return
    const { form } = this.state
    const self = this
    console.log(this.state.form)
    this.setState({processing: true})
    axios({
      method: 'put',
      url: config.route.products.update + form.id,
      data: qs.stringify(form),
      headers: {
        'x-access-token': window.localStorage["jwt-admin-token"],
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    })
    .then(function (response) {
      console.log(response.data)
      if (response.status === 200) {
        self.setState({processing: false})
        self.props.click_cancel()
      } else {
        console.log(response)
      }
    }).catch(function (error) {
      console.log(error)
    })
  }

  render() {
    const { title, show, click_cancel } = this.props
    const { form, tags, selected, processing } = this.state
    const active = show ? ' is-active' : ''
    const isLoading = processing ? ' is-loading': ''
    return (
      <div className={"modal" + active}>
        <div className="modal-background"></div>
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">{title}</p>
          </header>
          <section className="modal-card-body">
            <div className="field">
              <label className="label">標籤</label>
              <div className="control">
                <div className="select is-multiple">
                  <select multiple value={selected} onChange={this.selectTags.bind(this)}>
                    {tags.map((item, index) => (
                      <option 
                        key={index} 
                        value={item.id}
                      >
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
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

export default connect(mapStateToProps)(Tags)