import Vue from 'vue'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import VueTouch from 'vue-touch'

import Axios from './plugins/axios'
import EVars from './plugins/eVars'
import { MediaQueries } from './plugins/mediaQueries'
import ResponsiveBands from './mixins/responsiveBands'
import store from './store/store'

import App from './components/App.vue'
import HomePage from './components/HomePage/HomePage.vue'
import ProductCatalog from './components/ProductCatalog/ProductCatalog.vue'
import ProductDetails from './components/ProductDetails/ProductDetails.vue'
import Registration from './components/Registration/Registration.vue'
import ContactPage from './components/ContactPage/ContactPage.vue'
import AdminPanel from './components/AdminPanel/AdminPanel.vue'
import LoginForm from './components/LoginForm/LoginForm.vue'

const mediaQueries = new MediaQueries({ bands: ResponsiveBands })

export const ROUTES = [{
    path: '/productCatalog',
    name: 'home',
    component: HomePage,
    caption: 'HOME',
    vCentered: true
}, {
    path: '/productCatalog/products',
    name: 'products',
    component: ProductCatalog,
    caption: 'CATALOG',
    vCentered: false
}, {
    path: '/productCatalog/specs',
    name: 'specs',
    component: ProductDetails,
    caption: 'PRODUCT',
    vCentered: true
}, {
    path: '/productCatalog/register',
    name: 'register',
    component: Registration,
    caption: 'REGISTER',
    vCentered: true
}, {
    path: '/productCatalog/contacts',
    name: 'contacts',
    component: ContactPage,
    caption: 'CONTACT US',
    vCentered: true
}, {
    path: '/productCatalog/admin',
    name: 'admin',
    component: AdminPanel,
    caption: 'ADMIN',
    vCentered: false
}, {
    path: '/productCatalog/login',
    name: 'login',
    component: LoginForm,
    caption: 'LOGIN',
    vCentered: true
}, {
    path: '*',
    redirect: '/productCatalog',
    name: null,
    component: null,
    caption: null,
    vCentered: null
}]

VueTouch.config.swipe = {
    direction: 'horizontal'
}

Vue.use(VueTouch)
Vue.use(mediaQueries)
Vue.mixin(ResponsiveBands.mixin)
Vue.use(VueRouter)
Vue.use(Vuex)
Vue.use(Axios, '$axios')
Vue.use(EVars, '$eVars')

const router = new VueRouter({
    routes: ROUTES,
    mode: 'history'
})

new Vue({ // eslint-disable-line no-new
    el: '#app',
    store: store,
    router: router,
    mediaQueries: mediaQueries,
    render: (h) => h(App)
})
