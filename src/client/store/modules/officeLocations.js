import axios from 'axios'
import eVars from '../../../server/config/environment'

export default {
    namespaced: true,
    state: {
        data: [],
        apiUrl: `${eVars.API_URL}/countries/officeLocations`
    },
    mutations: {
        register: (state, officeLocationsData) => {
            state.data = officeLocationsData
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
