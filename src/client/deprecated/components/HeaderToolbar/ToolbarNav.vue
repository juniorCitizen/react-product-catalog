<template>
    <div class="navbar-end"
         :class="dynamicClasses">
        <ul :style="menuBorderStyle">
            <toolbar-nav-tab v-for="(route,routeIndex) in $router.options.routes"
                             v-if="routeAvailability(route)"
                             :key="route.name"
                             :routeIndex="routeIndex">
            </toolbar-nav-tab>
        </ul>
    </div>
</template>

<script>
    import { mapActions, mapGetters, mapMutations } from 'vuex'

    import ToolbarNavTab from './ToolbarNavTab.vue'

    export default {
        name: 'toolbar-nav',
        components: {
            ToolbarNavTab
        },
        props: [],
        data: function () {
            return {}
        },
        computed: {
            ...mapGetters({
                jwt: 'credentials/jwt'
            }),
            dynamicClasses: function () {
                return {
                    'tabs': !this.isOnMobileDevice,
                    'menu-list': this.isOnMobileDevice
                }
            },
            menuBorderStyle: function () {
                return this.isOnMobileDevice ? { 'border-bottom': '2px solid #00d1b2' } : { 'border': 'none' }
            }
        },
        watch: {},
        methods: {
            ...mapMutations({}),
            ...mapActions({}),
            routeAvailability: function (route) {
                return (
                    (route.path !== '*') &&
                    !((route.name === 'login') && (this.jwt)) &&
                    !((route.name === 'admin') && (!this.jwt)) &&
                    !(
                        ((route.name === 'admin') || (route.name === 'login')) &&
                        (this.isMobile || this.isTabletOnly)
                    )
                )
            }
        },
        beforeCreate: function () { },
        created: function () { },
        beforeMount: function () { },
        mounted: function () { },
        beforeUpdate: function () { },
        updated: function () { },
        beforeDestroy: function () { },
        destroyed: function () { }
    }
</script>

<style scoped></style>
