import eVars from '../../server/config/environment'

export default {
    install: (Vue, name = '$env') => {
        Object.defineProperty(Vue.prototype, name, { value: eVars })
    }
}
