import React from 'react'
import axios from 'axios'
import qs from 'qs'
import config from '../../../config'
import { update_products } from '../../../actions'

export default class Photo extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      files: '',
    }
  }

  _renderPreview() {
    if (this.state.files) {
      return this.state.files.map((item, idx) => {
        return (
          <div className="upload-append-list">
            <p>
              <strong>{item.name}</strong>
              <a href="javascript:void(0)"
                className="upload-delete"
                title="删除" index={idx}>
              </a>
              <br />
              <img src={item.thumb} className="upload-image" />
            </p>
            <span className={this.state.progress[idx] ? "upload-progress" : "upload-progress ry-hidden"}>
              {this.state.progress[idx]}
            </span>
          </div>
        )
      })
    } else {
      return null
    }
  }

  _renderUploadInfos() {
    if (this.state.uploadHistory) {
      return this.state.uploadHistory.map((item, idx) => {
        return (
          <p>
            <span>上传成功，图片地址是：</span>
            <input type="text" className="upload-url" value={item.relPath} />
            <a href={item.relPath} target="_blank">查看</a>
          </p>
        );
      })
    } else {
      return null;
    }
  }

  handleChange(e) {
    e.preventDefault()
    let target = e.target
    let files = target.files
    let count = this.state.multiple ? files.length : 1
    for (let i = 0; i < count; i++) {
      files[i].thumb = URL.createObjectURL(files[i])
    }
    // 转换为真正的数组
    files = Array.prototype.slice.call(files, 0)
    // 过滤非图片类型的文件
    files = files.filter(function (file) {
      return /image/i.test(file.type)
    })
  }


  upload(file, idx) {
    return new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest()
      if (xhr.upload) {
        // 上传中
        xhr.upload.addEventListener("progress", (e) => {
          // 处理上传进度
          this.handleProgress(file, e.loaded, e.total, idx);
        }, false)
        // 文件上传成功或是失败
        xhr.onreadystatechange = (e) => {
          if (xhr.readyState === 4) {
            if (xhr.status === 200) {
              // 上传成功操作
              this.handleSuccess(file, xhr.responseText)
              // 把该文件从上传队列中删除
              this.handleDeleteFile(file)
              resolve(xhr.responseText);
            } else {
              // 上传出错处理
              this.handleFailure(file, xhr.responseText)
              reject(xhr.responseText);
            }
          }
        }
        // 开始上传
        xhr.open("POST", this.state.uri, true)
        let form = new FormData()
        form.append("filedata", file)
        xhr.send(form)
      }
    })
  }

  handleProgress(file, loaded, total, idx) {
    let percent = (loaded / total * 100).toFixed(2) + '%';
    let _progress = this.state.progress;
    _progress[idx] = percent;
    this.setState({ progress: _progress })  // 反馈到DOM里显示
  }

  handleDragHover(e) {
    e.stopPropagation()
    e.preventDefault()
  }

  handleDrop(e) {
    this.setState({ progress: [] })
    this.handleDragHover(e)
    // 获取文件列表对象
    let files = e.target.files || e.dataTransfer.files
    let count = this.state.multiple ? files.length : 1
    for (let i = 0; i < count; i++) {
      files[i].thumb = URL.createObjectURL(files[i])
    }
    // 转换为真正的数组
    files = Array.prototype.slice.call(files, 0)
    // 过滤非图片类型的文件
    files = files.filter(function (file) {
      return /image/i.test(file.type)
    })
    this.setState({ files: this.state.files.concat(files) })
  }

  render() {
    return (
      <form action={this.state.uri} method="post" encType="multipart/form-data">
        <div className="ry-upload-box">
          <div className="upload-main">
            <div className="upload-choose">
              <input
                onChange={(v) => this.handleChange(v)}
                type="file"
                size={this.state.size}
                name="fileSelect"
                accept="image/*"
                multiple={this.state.multiple}
              />
              <span ref="dragBox"
                onDragOver={(e) => this.handleDragHover(e)}
                onDragLeave={(e) => this.handleDragHover(e)}
                onDrop={(e) => this.handleDrop(e)}
                className="upload-drag-area"
              >
                或者将图片拖到此处
              </span>
            </div>
            <div className={this.state.files.length ? "upload-preview" : "upload-preview ry-hidden"}>
              {this._renderPreview()}
            </div>
          </div>
          <div className={this.state.files.length ? "upload-submit" : "upload-submit ry-hidden"}>
            <button type="button"
              onClick={() => this.handleUpload()}
              className="upload-submit-btn">
              确认上传图片
            </button>
          </div>
          <div className="upload-info">
            {this._renderUploadInfos()}
          </div>
        </div>
      </form>
    )
  }
}