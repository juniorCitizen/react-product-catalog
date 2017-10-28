export default {
    namespaced: true,
    state: {
        ajaxInProgress: false
    },
    mutations: {
        start: (state) => {
            state.ajaxInProgress = true
        },
        stop: (state) => {
            state.ajaxInProgress = false
        }
    },
    getters: {
        activated: (state) => { return state.ajaxInProgress }
    },
    actions: {}
}
