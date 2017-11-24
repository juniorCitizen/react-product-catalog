import React from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import config from '../../config'
import { connect } from 'react-redux'
import config from '../../config'

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
        }
    }

    getHotList() {
        this.setState({new_list: []})
    }

    getNewList() {
        this.setState({hot_list: []})
    }

    getPRoductList(code) {
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

    render() {
        const { series } = this.props
        this.getPRoductList(series.code)
        const { list, hot_list, new_list } = this.state 
        var hot = (cou) => {
            let arr = []
            for (var i = 0; i < cou; i++) {
                arr.push(
                    <div className="column is-2" key={i} style={style.images}>
                        <div className="v-image-box">
                            <img className="v-image" src="https://bulma.io/images/placeholders/256x256.png"/>
                            <div className="v-image-label">
                                HI~~~~
                            </div>
                        </div>
                    </div>
                );
            }
            return arr;
        }
        return(          
            <div>
                {series.code === null ? 'no select' : series.code}
                <div className="columns is-multiline">
                    {hot(10)}
                </div>
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
	const { series } = state
	return {
		series
	}
}

export default connect(mapStateToProps)(Block)