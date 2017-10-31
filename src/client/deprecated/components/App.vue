<template>
    <div id="app">
        <header-toolbar></header-toolbar>
        <!-- dynamic class 'is-fullheight' vertically centers content -->
        <!-- dynamic style push contents down so doesn't get covered by the header toolbar-->
        <section class="hero"
                 :class="{'is-fullheight':vCentered}"
                 :style="dynamicStyles">
            <router-view></router-view>
        </section>
        <page-footer></page-footer>
    </div>
</template>

<script>
    import { mapActions, mapGetters, mapMutations } from 'vuex'

    import HeaderToolbar from './HeaderToolbar/HeaderToolbar.vue'
    import PageFooter from './PageFooter/PageFooter.vue'

    export default {
        name: 'app',
        components: {
            HeaderToolbar,
            PageFooter
        },
        props: [],
        data: function () {
            return {
                vCentered: false //
            }
        },
        computed: {
            ...mapGetters({
                headerToolbarHeight: 'viewport/headerToolbarHeight',
                clientWidth: 'viewport/clientWidth',
                clientHeight: 'viewport/clientHeight',
                mobileNavMenuActivated: 'mobileNavMenu/activated'
            }),
            dynamicStyles: function () {
                return !this.vCentered ? { 'margin-top': this.headerToolbarHeight + 1 + 'px' } : {}
            }
        },
        watch: {
            // watch route changes and extract vCentered attribute
            // used to determine if the current view should be vertically centered
            '$route': function (to, from) {
                this.vCentered = this.$router.options.routes.filter((route) => {
                    return route.name === to.name
                })[0].vCentered
                if (to.path === '/productCatalog/admin') {
                    this.resetProductDataForm()
                }
            },
            // monitors client windows size changes
            // when size increased over threshold, mobile navigation menu is deactivated
            'isTabletOnly': function (isTabletOnlyValue) {
                if (!isTabletOnlyValue && this.isDesktop && this.mobileNavMenuActivated) {
                    this.deactivateMobileNavMenu()
                }
            }
        },
        methods: {
            ...mapMutations({
                deactivateMobileNavMenu: 'mobileNavMenu/deactivate',
                resetProductDataForm: 'productData/reset',
                register: 'viewport/register'
            }),
            ...mapActions({
                initialize: 'initialize'
            }),
            // method to register client width in store
            registerClientWidth: function () {
                this.register({
                    stateProperty: 'clientWidth',
                    value: document.documentElement.clientWidth
                })
            },
            // method to register client height in store
            registerClientHeight: function () {
                this.register({
                    stateProperty: 'clientHeight',
                    value: document.documentElement.clientHeight
                })
            }
        },
        beforeCreate: function () { },
        created: function () {
            this.initialize()
        },
        beforeMount: function () { },
        mounted: function () {
            // check if view should be vertically centered for the first time
            this.vCentered = this.$router.options.routes.filter((route) => {
                return route.name === this.$route.name
            })[0].vCentered
            // add event listeners to monitor client window size changes
            this.$nextTick(() => {
                window.addEventListener('resize', this.registerClientWidth)
                window.addEventListener('resize', this.registerClientHeight)
                this.registerClientWidth()
                this.registerClientHeight()
            })
        },
        beforeUpdate: function () { },
        updated: function () { },
        beforeDestroy: function () {
            // remove window size change listener
            window.removeEventListener('resize', this.registerClientWidth)
            window.removeEventListener('resize', this.registerClientHeight)
        },
        destroyed: function () { }
    }
</script>

<style scoped>
    section.hero {
        /* so the view never blocks the toolbars*/
        z-index: 0;
    }
</style>
