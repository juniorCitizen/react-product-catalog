import React from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import config from '../../config'
import Detail from './detail'

const api = config.api

class Block extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            list: [],
            hot_list: [],
            new_list: [],
            current: 0,
            total: 0,
            show_detail: false,
            product_info: {
                name: '',
                specification: '',
                description: '',
            },
        }
    }

    getHotList() {
        this.setState({new_list: []})
    }

    getNewList() {
        this.setState({hot_list: []})
    }

    getProductList(code) {
        console.log('series code:' + code)
        if (code === null) {
            //this.getHotList()
            this.getNewList()
            return
        }
        return
        axios({
            method: 'get',
            url: api + 'product/' + code + '/1',
            data: null,
            headers: {
                'x-access-token': window.localStorage["jwt-token"],
                'Content-Type': 'application/json',
            }
        })
        .then(function (response) {
            if (response.status === 200) {
                let data = response.data
                self.setState({
                    list: data.list,
                    current: data.current,
                    total: data.total,
                })
                self.loginSuccess()
            } else {
                console.log(response.data)
            }
        }).catch(function (error) {
            console.log(error)
        })
    }

    showDetail(item) {
        console.log(item)
        this.setState({
            show_detail: true,
            product_info: item,
        })
    }

    render() {
        const { series, product } = this.props
        //this.getProductList(series.code)
        const { list, hot_list, new_list, show_detail, product_info } = this.state 
        var prod_list = (data, event) => {
            let arr = []
            for (var i = 0; i < data.length; i++) {
                arr.push(
                    <div className="column is-2" key={i} style={style.images}>
                        <div className="v-image-box">
                            <img className="v-image" src="https://bulma.io/images/placeholders/256x256.png"/>
                            <div className="v-image-label">
                                product descirption
                            </div>
                        </div>
                    </div>
                );
            }
            return arr;
        }
        return(          
            <div>
                {series.code && 
                    <div className="columns is-multiline">
                        {product.products.map((item, index) => (
                            <div className="column is-2" key={index} style={style.images}>
                                <div className="v-image-box" onClick={this.showDetail.bind(this, item)}>
                                    <img className="v-image" src="https://bulma.io/images/placeholders/256x256.png"/>
                                    <div className="v-image-label">
                                        product descirption
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                }
                <Detail show={show_detail} info={product_info}/>
            </div>
        )
    }
}

const style = {
    images: {
        margin: '3px',
        padding: '0',
        height: '256px',
        width: '256px',
    }
}

function mapStateToProps(state) {
	const { series, product } = state
	return {
        series,
        product,
	}
}

export default connect(mapStateToProps)(Block)