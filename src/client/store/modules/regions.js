import axios from 'axios'
import eVars from '../../../server/config/environment'

export default {
    namespaced: true,
    state: {
        data: [],
        apiUrl: `${eVars.API_URL}/countries/regions`
    },
    mutations: {
        register: (state, regionsData) => {
            state.data = regionsData
        },
        reset: (state) => {
            state.data = []
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
