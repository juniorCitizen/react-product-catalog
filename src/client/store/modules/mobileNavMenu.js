export default {
    namespaced: true,
    state: {
        mobileNavMenu: false
    },
    mutations: {
        toggle: (state) => { state.mobileNavMenu = !state.mobileNavMenu },
        activate: (state) => { state.mobileNavMenu = true },
        deactivate: (state) => { state.mobileNavMenu = false }
    },
    getters: {
        activated: (state) => { return state.mobileNavMenu }
    },
    actions: {}
}
