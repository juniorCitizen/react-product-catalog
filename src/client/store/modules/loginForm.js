const DEFAULT_STATE = {
    email: '',
    loginId: '',
    password: '',
    botPrevention: ''
}

export default {
    namespaced: true,
    state: DEFAULT_STATE,
    mutations: {
        register: (state, payload) => {
            state[payload.name] = payload.value
        },
        reset: (state) => {
            state.email = ''
            state.loginId = ''
            state.password = ''
            state.botPrevention = ''
            state.validation.state = false
        }
    },
    getters: {
        email: (state) => { return state.email },
        loginId: (state) => { return state.loginId },
        password: (state) => { return state.password },
        botPrevention: (state) => { return state.botPrevention },
        state: (state) => { return state }
    },
    actions: {},
    modules: {
        validation: {
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
                        let validationConditions = {
                            email: rootState.loginForm.email !== '' && validEmailString(rootState.loginForm.email),
                            loginId: rootState.loginForm.loginId !== '',
                            password: rootState.loginForm.password !== ''
                        }
                        return validationConditions[field]
                    }
                },
                form: (state, getters, rootState) => {
                    return (
                        (rootState.loginForm.email !== '') &&
                        validEmailString(rootState.loginForm.email) &&
                        (rootState.loginForm.loginId !== '') &&
                        (rootState.loginForm.password !== '')
                    )
                }
            }
        }
    }
}

function validEmailString(emailString) {
    return (/^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/.test(emailString))
}
