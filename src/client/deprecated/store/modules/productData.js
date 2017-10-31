import Promise from 'bluebird'
import Vue from 'vue'

const EMPTY_FORM_STATE = {
    seriesId: -1,
    type: 'unselected',
    code: '',
    name: '',
    description: '',
    primaryPhoto: null,
    secondaryPhotos: null
}

let validation = {
    namespaced: true,
    state: {
        state: false
    },
    mutations: {
        toggle: (state) => { state.state = !state.state },
        activate: (state) => { state.state = true },
        deactivate: (state) => { state.state = false }
    },
    getters: {
        state: (state) => { return state.state },
        input: (state, getters, rootState) => {
            return (field) => {
                return rootState.productData.form[field] !== EMPTY_FORM_STATE[field]
            }
        },
        form: (state, getters, rootState) => {
            return rootState.productData.form.seriesId !== EMPTY_FORM_STATE.seriesId &&
                rootState.productData.form.type !== EMPTY_FORM_STATE.type &&
                rootState.productData.form.code !== EMPTY_FORM_STATE.code &&
                rootState.productData.form.name !== EMPTY_FORM_STATE.name &&
                rootState.productData.form.description !== EMPTY_FORM_STATE.description &&
                rootState.productData.form.primaryPhoto !== EMPTY_FORM_STATE.primaryPhoto &&
                rootState.productData.form.secondaryPhotos !== EMPTY_FORM_STATE.secondaryPhotos
        }
    }
}

let form = {
    namespaced: true,
    state: {
        seriesId: -1,
        type: 'unselected',
        code: '',
        name: '',
        description: '',
        primaryPhoto: null,
        secondaryPhotos: null,
        ignoredPhotos: []
    },
    mutations: {
        register: (state, payload) => {
            state[payload.name] = payload.value
            if (payload.name === 'secondaryPhotos') {
                state.ignoredPhotos = []
                if (payload.value !== null) {
                    for (let counter = 0; counter < payload.value.length; counter++) {
                        state.ignoredPhotos.push(false)
                    }
                }
            }
        },
        ignore: (state, photoIndex) => {
            Vue.set(state.ignoredPhotos, photoIndex, true)
        },
        include: (state, photoIndex) => {
            Vue.set(state.ignoredPhotos, photoIndex, false)
        },
        reset: (state) => {
            state.validation.state = false
            state.seriesId = -1
            state.type = 'unselected'
            state.code = ''
            state.name = ''
            state.description = ''
            state.primaryPhoto = null
            state.secondaryPhotos = null
            state.ignoredPhotos = []
        }
    },
    getters: {
        seriesId: (state) => { return state.seriesId },
        type: (state) => { return state.type },
        code: (state) => { return state.code },
        name: (state) => { return state.name },
        description: (state) => { return state.description },
        primaryPhoto: (state) => { return state.primaryPhoto },
        secondaryPhotos: (state) => { return state.secondaryPhotos },
        ignoredPhotos: (state) => { return state.ignoredPhotos },
        includedCount: (state) => {
            return state.ignoredPhotos.filter((ignoredPhoto) => {
                return ignoredPhoto === false
            }).length
        },
        formData: (state, getters, rootState) => {
            if (!getters['validation/form']) {
                return false
            } else {
                let formData = new FormData()
                if (rootState.productData.newEntry) {
                    formData.append('seriesId', state.seriesId)
                    formData.append('type', state.type)
                    formData.append('code', state.code.toUpperCase())
                    formData.append('name', state.name)
                    formData.append('text', state.description)
                    formData.append('primaryPhoto', state.primaryPhoto[0])
                    for (let counter = 0; counter < state.secondaryPhotos.length; counter++) {
                        if (!state.ignoredPhotos[counter]) {
                            formData.append('secondaryPhotos', state.secondaryPhotos[counter])
                        }
                    }
                    return formData
                } else {
                    let prestine = true
                    let updateTargetRecord = rootState.products.data.filter((product) => {
                        return product.id === rootState.productData.updateTargetRecordId
                    })[0]
                    formData.append('code', state.code.toUpperCase())
                    if (state.code.toUpperCase() !== updateTargetRecord.code) {
                        prestine = false
                    }
                    formData.append('name', state.name)
                    if (state.name !== updateTargetRecord.name) {
                        prestine = false
                    }
                    formData.append('text', state.description)
                    if (state.description !== updateTargetRecord.description.text) {
                        prestine = false
                    }
                    if (state.primaryPhoto[0].id === undefined) {
                        formData.append('primaryPhoto', state.primaryPhoto[0])
                        prestine = false
                    }
                    if (state.secondaryPhotos[0].id === undefined) {
                        for (let counter = 0; counter < state.secondaryPhotos.length; counter++) {
                            if (!state.ignoredPhotos[counter]) {
                                formData.append('secondaryPhotos', state.secondaryPhotos[counter])
                            }
                        }
                        prestine = false
                    } else {
                        let photoRemovalList = []
                        state.ignoredPhotos.forEach((ignoredPhoto, photoIndex) => {
                            if (ignoredPhoto) {
                                photoRemovalList.push(state.secondaryPhotos[photoIndex].id)
                            }
                        })
                        if (photoRemovalList.length > 0) {
                            photoRemovalList.forEach((photoRemovalItem) => {
                                formData.append('photoRemovalList[]', photoRemovalItem)
                            })
                            prestine = false
                        }
                    }
                    if (prestine === false) {
                        formData.append('id', rootState.productData.updateTargetRecordId)
                        return formData
                    } else {
                        return false
                    }
                }
            }
        }
    },
    actions: {
        register: (context, payload) => {
            if ((payload.name === 'primaryPhoto') && (payload.value.length !== 1)) {
                let error = new Error('primary photo count must be equal to 1')
                error.name = 'primaryPhotoCountCountraint'
                return Promise.reject(error)
            } else if ((payload.name === 'secondaryPhotos') && (payload.value.length < 2) && (payload.value.length > 15)) {
                let error = new Error('secondary photo count must be at least 2 or less then or equal to 15')
                error.name = 'secondaryPhotoCountCountraint'
                return Promise.reject(error)
            } else {
                context.commit('register', payload)
                return Promise.resolve()
            }
        }
    },
    modules: {
        validation: validation
    }
}

export default {
    namespaced: true,
    state: {
        newEntry: true,
        updateTargetRecordId: null
    },
    mutations: {
        newEntry: (state) => { state.newEntry = true },
        updateRecord: (state, productData) => {
            state.form.validation.state = false
            state.newEntry = false
            state.form.seriesId = productData.seriesId
            state.form.type = productData.type
            state.form.code = productData.code
            state.form.name = productData.name
            state.form.description = productData.description.text
            state.form.primaryPhoto = productData.photos.slice(0, 1)
            state.form.secondaryPhotos = productData.photos.slice(1, productData.photos.length)
            state.form.ignoredPhotos = []
            for (let counter = 0; counter < state.form.secondaryPhotos.length; counter++) {
                state.form.ignoredPhotos.push(false)
            }
            state.updateTargetRecordId = productData.id
        },
        reset: (state) => {
            state.form.validation.state = false
            state.form.seriesId = -1
            state.form.type = 'unselected'
            state.form.code = ''
            state.form.name = ''
            state.form.description = ''
            state.form.primaryPhoto = null
            state.form.secondaryPhotos = null
            state.form.ignoredPhotos = []
            state.newEntry = true
            state.updateTargetRecordId = null
        }
    },
    getters: {
        newEntry: (state) => { return state.newEntry },
        updateTargetRecordId: (state) => { return state.updateTargetRecordId }
    },
    actions: {},
    modules: {
        form: form
    }
}
