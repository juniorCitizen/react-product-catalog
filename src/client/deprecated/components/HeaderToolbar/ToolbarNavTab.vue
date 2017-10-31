<template>
    <li class="navbar-item"
        :class="{'has-text-right':isOnMobileDevice}"
        :style="liDynamicStyle"
        @mouseenter="hoverState=true"
        @mouseleave="hoverState=false"
        @click="deactivateMobileNavMenu">
        <router-link :class="{'is-active':isActiveRoute}"
                     :style="routerLinkDynamicStyle"
                     :to="$router.options.routes[routeIndex].path">
            <b>{{ $router.options.routes[routeIndex].caption }}</b>
        </router-link>
    </li>
</template>

<script>
    import { mapActions, mapGetters, mapMutations } from 'vuex'

    export default {
        name: 'toolbar-nav-tab',
        components: {},
        props: [
            'routeIndex'
        ],
        data: function () {
            return {
                hoverState: false
            }
        },
        computed: {
            ...mapGetters({}),
            isActiveRoute: function () {
                return this.$route.name === this.$router.options.routes[this.routeIndex].name
            },
            routerLinkDynamicStyle: function () {
                if (!this.isOnMobileDevice && this.isActiveRoute) {
                    return {
                        'color': '#00d1b2',
                        'pointer-events': 'none',
                        'border-bottom-color': '#00d1b2',
                        'border-bottom-width': '2px'
                    }
                } else if (this.isActiveRoute) {
                    return {
                        'pointer-event': 'none',
                        'cursor': 'default'
                    }
                } else if (!this.isOnMobileDevice && !this.isActiveRoute && this.hoverState) {
                    return {
                        'color': '#00d1b2',
                        'border-bottom-color': '#00d1b2',
                        'border-bottom-width': '2px'
                    }
                } else if (this.isOnMobileDevice && !this.isActiveRoute && this.hoverState) {
                    return {
                        'color': '#00d1b2'
                    }
                }
            },
            liDynamicStyle: function () {
                if (!this.isOnMobileDevice) {
                    return {
                        'padding-left': '10px',
                        'padding-right': '10px'
                    }
                } else {
                    return {
                        'padding-top': '1px',
                        'padding-bottom': '1px'
                    }
                }
            }
        },
        watch: {},
        methods: {
            ...mapMutations({
                deactivateMobileNavMenu: 'mobileNavMenu/deactivate'
            }),
            ...mapActions({})
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

<style scoped>
    b {
        color: darkgreen;
    }
</style>
