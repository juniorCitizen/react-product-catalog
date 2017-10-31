export default {
    namespaced: true,
    state: {
        productIds: []
    },
    mutations: {
        reset: (state) => {
            state.productIds = []
        },
        register: (state, payload) => {
            let index = state.productIds.findIndex((productId) => {
                return productId === payload.productId
            })
            if (index === -1) {
                state.productIds.push(payload.productId)
            } else {
                state.productIds.splice(index, 1)
            }
        }
    },
    getters: {
        isInterested: (state) => {
            return (productId) => {
                let isInterested = state.productIds.findIndex((id) => {
                    return id === productId
                })
                return isInterested !== -1
            }
        },
        itemCount: (state) => { return state.productIds.length },
        productIds: (state) => { return state.productIds }
    }
}
