import axios from 'axios'
import Promise from 'bluebird'

import eVars from '../../../server/config/environment'

export default {
    reset: (context) => {
        context.commit('interestedProducts/reset')
        context.commit('viewport/reset')
        context.commit('mobileNavMenu/deactivate')
        context.commit('regions/reset')
        context.commit('countries/reset')
        context.commit('officeLocations/reset')
        context.commit('series/reset')
        context.commit('products/reset')
        context.commit('loginForm/reset')
        context.commit('flowControl/stop')
        context.commit('credentials/reset')
        context.commit('productData/reset')
    },
    initialize: (context) => {
        context.dispatch('reset')
        const apiDataNodes = [{
            dispatch: 'regions/fetch',
            commits: ['regions/register']
        }, {
            dispatch: 'countries/fetch',
            commits: ['countries/register']
        }, {
            dispatch: 'officeLocations/fetch',
            commits: ['officeLocations/register']
        }, {
            dispatch: 'series/fetch',
            commits: ['series/register']
        }, {
            dispatch: 'products/fetch',
            commits: ['products/register']
        }]
        let initProcedures = []
        apiDataNodes.forEach((apiDataNode, nodeIndex, nodeArray) => {
            initProcedures.push({
                dispatch: context.dispatch(apiDataNode.dispatch),
                commit: apiDataNode.commits[0],
                additionalCommits: []
            })
            let workingNode = nodeArray[nodeIndex]
            let additionalCommits = workingNode.commits.slice(1, workingNode.commits.length)
            if (additionalCommits.length > 0) {
                initProcedures[nodeIndex].additionalCommits = additionalCommits
            }
        })
        Promise
            .each(initProcedures, (initProcedure) => {
                return initProcedure
            })
            .then((initProcedureResults) => {
                return initProcedureResults.forEach((initProcedureResult) => {
                    initProcedureResult
                        .dispatch
                        .then((fetchedApiData) => {
                            context.commit(initProcedureResult.commit, fetchedApiData.data.data)
                            return initProcedureResult.additionalCommits.forEach((commit) => {
                                context.commit(commit)
                            })
                        })
                })
            })
            .catch((error) => {
                console.log(error.name)
                console.log(error.message)
                console.log(error.stack)
                alert('App initialization failure...')
                window.location.assign(`${eVars.HOST}/404.html`)
            })
    },
    login: (context) => {
        context.commit('flowControl/start')
        return axios({
            method: 'post',
            url: `${eVars.API_URL}/token`,
            data: context.getters['loginForm/state']
        }).then((token) => {
            context.commit('loginForm/reset')
            context.commit('credentials/forgetUser')
            context.commit('credentials/register', token.data.data.token)
            context.commit('flowControl/stop')
            return Promise.resolve()
        }).catch((error) => {
            context.commit('loginForm/register', {
                name: 'password',
                value: ''
            })
            context.commit('loginForm/validation/deactivate')
            context.commit('flowControl/stop')
            return Promise.reject(error)
        })
    },
    registerNewProduct: (context) => {
        if (!context.getters['productData/form/validation/form']) {
            let error = new Error('product data is not ready')
            error.name = 'productDataNotReady'
            return Promise.reject(error)
        } else {
            if (context.getters['productData/form/formData']) {
                context.commit('flowControl/start')
                return axios({
                    method: 'post',
                    url: `${eVars.API_URL}/products`,
                    data: context.getters['productData/form/formData'],
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'x-access-token': context.getters['credentials/jwt']
                    }
                }).then((apiResponse) => {
                    context.commit('products/addProduct', apiResponse.data.data)
                    context.commit('series/addProduct', apiResponse.data.data)
                    context.commit('productData/reset')
                    context.commit('flowControl/stop')
                    return Promise.resolve()
                }).catch((error) => {
                    context.commit('productData/form/validation/deactivate')
                    context.commit('flowControl/stop')
                    return Promise.reject(error)
                })
            }
        }
    },
    deleteProductRecord: (context, productId) => {
        let seriesId = context.getters['productData/form/seriesId']
        context.commit('flowControl/start')
        return axios({
            method: 'delete',
            url: `${eVars.API_URL}/products?productId=${productId}`,
            headers: {
                'x-access-token': context.getters['credentials/jwt']
            }
        }).then(() => {
            context.commit('productData/reset')
            context.commit('series/removeProduct', {
                seriesId: seriesId,
                productId: productId
            })
            context.commit('products/removeProduct', productId)
            context.commit('flowControl/stop')
            return Promise.resolve()
        }).catch((error) => {
            context.commit('flowControl/stop')
            return Promise.reject(error)
        })
    },
    updateExistingProduct: (context) => {
        if (!context.getters['productData/form/validation/form']) {
            let error = new Error('product data is not ready')
            error.name = 'productDataNotReady'
            return Promise.reject(error)
        } else {
            if (context.getters['productData/form/formData']) {
                context.commit('flowControl/start')
                return axios({
                    method: 'put',
                    url: `${eVars.API_URL}/products`,
                    data: context.getters['productData/form/formData'],
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'x-access-token': context.getters['credentials/jwt']
                    }
                }).then((apiResponse) => {
                    context.commit('products/updateProduct', apiResponse.data.data)
                    context.commit('series/updateProduct', apiResponse.data.data)
                    context.commit('productData/reset')
                    context.commit('flowControl/stop')
                    return Promise.resolve()
                }).catch((error) => {
                    console.log(error.name)
                    console.log(error.message)
                    console.log(error.stack)
                    context.commit('productData/form/validation/deactivate')
                    context.commit('flowControl/stop')
                    return Promise.reject(error)
                })
            } else {
                let error = new Error('表單資料不完整或未發現可修正資料')
                error.name = 'noUpdateDataAvailable'
                return Promise.reject(error)
            }
        }
    },
    userRegistration: (context, payload) => {
        context.commit('flowControl/start')
        if (payload.authorized) {
            payload.interestedProducts = context.getters['interestedProducts/productIds']
        }
        return axios({
            method: 'post',
            url: `${eVars.API_URL}/registrations`,
            data: payload
        }).then((apiResponse) => {
            context.commit('credentials/rememberUser', {
                company: apiResponse.data.data.company,
                name: apiResponse.data.data.name,
                email: apiResponse.data.data.email,
                countryId: apiResponse.data.data.countryId
            })
            context.commit('interestedProducts/reset')
            context.commit('flowControl/stop')
            return Promise.resolve(apiResponse.data.data)
        }).catch((error) => {
            context.commit('flowControl/stop')
            return Promise.reject(error)
        })
    }
}
