<template>
    <div class="hero-body">
        <div v-if="!isOnMobileDevice"
             class="container columns is-fluid">
            <span class="column is-narrow">
                <side-menu></side-menu>
            </span>
            <span class="column">
                <product-data-form></product-data-form>
            </span>
        </div>
        <div v-else
             class="columns is-centered">
            <div class="column has-text-centered">不支援行動裝置解析度</div>
            <div class="column has-text-centered">Mobile Device is Unsupported</div>
        </div>
    </div>
</template>

<script>
    import { mapActions, mapGetters, mapMutations } from 'vuex'

    import SideMenu from './SideMenu.vue'
    import ProductDataForm from './ProductDataForm/ProductDataForm.vue'

    export default {
        name: 'admin-panel',
        components: {
            SideMenu,
            ProductDataForm
        },
        props: [],
        data: function () {
            return {}
        },
        computed: {
            ...mapGetters({
                jwt: 'credentials/jwt'
            })
        },
        watch: {
            jwt: function (jwtContent) {
                if (!jwtContent) {
                    this.forwardToLoginView()
                }
            }
        },
        methods: {
            ...mapMutations({}),
            ...mapActions({}),
            forwardToLoginView: function () {
                this.$router.replace(this.$router.options.routes[5].path)
            }
        },
        beforeCreate: function () { },
        created: function () { },
        beforeMount: function () { },
        mounted: function () {
            if (!this.jwt) {
                this.forwardToLoginView()
            }
        },
        beforeUpdate: function () { },
        updated: function () {
            if (!this.jwt) {
                this.forwardToLoginView()
            }
        },
        beforeDestroy: function () { },
        destroyed: function () { }
    }
</script>

<style scoped></style>
