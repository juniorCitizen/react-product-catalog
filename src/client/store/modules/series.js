import axios from 'axios'
import Vue from 'vue'

import eVars from '../../../server/config/environment'

export default {
    namespaced: true,
    state: {
        data: [],
        activeSeriesIndex: 0,
        apiUrl: `${eVars.API_URL}/products/series`
    },
    mutations: {
        register: (state, seriesData) => {
            state.data = seriesData
            state.activeSeriesIndex = 0
        },
        reset: (state) => {
            state.data = []
            state.activeSeriesIndex = 0
        },
        toggleMenu: (state, seriesIndex) => {
            state.activeSeriesIndex = state.activeSeriesIndex === seriesIndex ? 0 : seriesIndex
        },
        addProduct: (state, product) => {
            let products = state.data[product.seriesId].products
            products.push(product)
            products.sort((a, b) => {
                if (a.code.toUpperCase() > b.code.toUpperCase()) {
                    return 1
                } else if (a.code.toUpperCase() < b.code.toUpperCase()) {
                    return -1
                } else {
                    return 0
                }
            })
        },
        updateProduct: (state, payload) => {
            let productIndex = state.data[payload.seriesId].products.findIndex((product) => {
                return (
                    product.id === payload.id
                )
            })
            Vue.set(state.data[payload.seriesId].products, productIndex, payload)
            state.data[payload.seriesId].products.sort((a, b) => {
                if (a.code.toUpperCase() > b.code.toUpperCase()) {
                    return 1
                } else if (a.code.toUpperCase() < b.code.toUpperCase()) {
                    return -1
                } else {
                    return 0
                }
            })
        },
        removeProduct: function (state, payload) {
            let productIndex = state.data[payload.seriesId].products.findIndex((product) => {
                return (
                    product.id === payload.productId
                )
            })
            state.data[payload.seriesId].products.splice(productIndex, 1)
        }
    },
    getters: {
        data: (state) => { return state.data },
        activeSeriesIndex: (state) => { return state.activeSeriesIndex },
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
