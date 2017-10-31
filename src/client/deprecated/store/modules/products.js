import axios from 'axios'
import Vue from 'vue'

import eVars from '../../../server/config/environment'

export default {
    namespaced: true,
    state: {
        data: [],
        apiUrl: `${eVars.API_URL}/products`
    },
    mutations: {
        register: (state, productsData) => {
            state.data = productsData
        },
        reset: (state) => {
            state.data = []
        },
        addProduct: (state, product) => {
            state.data.push(product)
            state.data.sort((a, b) => {
                if (a.code.toUpperCase() > b.code.toUpperCase()) {
                    return 1
                } else if (a.code.toUpperCase() < b.code.toUpperCase()) {
                    return -1
                } else {
                    return 0
                }
            })
        },
        updateProduct: (state, product) => {
            let productIndex = state.data.findIndex((productEntry) => {
                return (
                    productEntry.id === product.id
                )
            })
            Vue.set(state.data, productIndex, product)
            state.data.sort((a, b) => {
                if (a.code.toUpperCase() > b.code.toUpperCase()) {
                    return 1
                } else if (a.code.toUpperCase() < b.code.toUpperCase()) {
                    return -1
                } else {
                    return 0
                }
            })
        },
        removeProduct: function (state, productId) {
            let productIndex = state.data.findIndex((product) => {
                return (
                    product.id === productId
                )
            })
            state.data.splice(productIndex, 1)
        }
    },
    getters: {
        data: (state) => { return state.data },
        apiUrl: (state) => { return state.apiUrl }
    },
    actions: {
        fetch: (context) => {
            return axios({
                method: 'get',
                url: context.state.apiUrl
            })
        }
    }
}
