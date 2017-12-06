import React from 'react'

export default class User extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            list: [
                {
                    email: 'test@test.com',
                    name: 'test',
                    address: '123456789',
                    telephone: '12-3456789',
                },
            ],
            page: 1,
            s_item: {},
            search: '',
            add_show: false,
            edit_show: false,
            delete_show: false,
        }
    }

    componentDidMount() {
        
    }

    showAdd() {
        this.setState({
            showAdd: true,
            s_item: {},
        })
    }

    showEdit(item) {
        this.setState({
            showEdit: true,
            s_item: item,
        })
    }

    showDelete(item) {
        this.setState({
            showDelete: true,
            s_item: item,
        })
    }

    hideAdd() {
        this.setState({
            showAdd: false,
            s_item: {},
        })
    }

    hideEdit() {
        this.setState({
            showEdit: false,
            s_item: {},
        })
    }

    hideDelete() {
        this.setState({
            showDelete: false,
            s_item: {},
        })
    }

    searchChange(e) {
        let val = e.target.value
        this.setState({search: val})
    }

    insertData(item) {
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

    updateData(item) {
        axios({
            method: 'put',
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

    deleteData(item) {
        axios({
            method: 'delete',
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

    doSearch() {

        axios({
            method: 'get',
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
        const { list, page, search, add_show, edit_show } = this.state
        return( 
            <div className="container" style={style.container}>
                <nav className="level" style={style.level}>
                    <div className="level-left">
                        <div className="level-item">
                            <div className="" style={style.toolBar}>
                                <div className="field has-addons">
                                    <div className="control">
                                        <input className="input" type="text" placeholder="輸入搜尋值" 
                                            value={search}
                                            onChange={this.searchChange.bind(this)}/>
                                    </div>
                                    <div className="control">
                                        <button className="button is-info" onClick={this.doSearch.bind(this)}>
                                            搜尋
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="level-right">
                        <div className="level-item">
                            <div className="" style={style.toolBar}>
                                <div className="field has-addons">
                                    <button className="button is-primary" style={style.tableButton} onClick={this.showAdd.bind(this)}>
                                        建立新資料
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>
                <table className="table is-bordered is-striped is-narrow is-fullwidth">
                    <thead>
                        <tr>
                            <th>email</th>
                            <th>名稱</th>
                            <th>地址</th>
                            <th>聯絡電話</th>
                            <th width="101"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {list.map((item, index) => (
                            <tr key={index}>
                                <td>{item.email}</td>
                                <td>{item.name}</td>
                                <td>{item.address}</td>
                                <td>{item.telephone}</td>
                                <td>
                                    <button className="button" style={style.tableButton} onClick={this.showEdit.bind(this, item)}>
                                        <span className="icon has-text-info">
                                            <i className="fa fa-edit fa-lg"></i>
                                        </span>
                                    </button>
                                    <button className="button" style={style.tableButton} onClick={this.showDelete.bind(this, item)}>
                                        <span className="icon has-text-danger">
                                            <i className="fa fa-trash fa-lg"></i>
                                        </span>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>   
            </div>
        )
    }
}

const style = {
    level: {
        margin: '0px',
        padding: '0px',
    },
    box: {
        marginTop: '10px',
    },
    tableButton:{
        margin: '0px 3px 0 3px',
    },
    toolBar: {
        margin: '10px 0px 10px 0px',
    },
    container: {
        padding: '10px',
    },
}

/*
function compare(a,b) {
  if (a.last_nom < b.last_nom)
    return -1;
  if (a.last_nom > b.last_nom)
    return 1;
  return 0;
}

objs.sort(compare);
*/