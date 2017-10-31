import axios from 'axios'

export default {
    install: (Vue, name = '$axios') => {
        Object.defineProperty(Vue.prototype, name, { value: axios })
    }
}
