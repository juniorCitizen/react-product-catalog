export default {
    namespaced: true,
    state: {
        clientWidth: document.documentElement.clientWidth,
        clientHeight: document.documentElement.clientHeight,
        headerToolbarHeight: null,
        pageFooterHeight: null
    },
    mutations: {
        register: (state, payload) => {
            state[payload.stateProperty] = payload.value
        },
        reset: (state) => {
            state = {
                clientWidth: document.documentElement.clientWidth,
                clientHeight: document.documentElement.clientHeight,
                headerToolbarHeight: null,
                pageFooterHeight: null
            }
        }
    },
    getters: {
        clientWidth: state => state.clientWidth,
        clientHeight: state => state.clientHeight,
        headerToolbarHeight: state => state.headerToolbarHeight,
        pageFooterHeight: state => state.pageFooterHeight
    },
    actions: {}
}
