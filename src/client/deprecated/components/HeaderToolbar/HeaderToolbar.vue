<template>
    <header id="header-toolbar"
            class="navbar is-transparent">
        <div class="navbar-brand">
            <logo></logo>
            <company-title v-show="!isMobile"></company-title>
            <burger-icon></burger-icon>
        </div>
        <div id="mobile-nav-menu"
             class="navbar-menu"
             :class="dynamicClasses">
            <toolbar-nav></toolbar-nav>
        </div>
    </header>
</template>

<script>
    import { mapActions, mapGetters, mapMutations } from 'vuex'

    import BurgerIcon from './BurgerIcon.vue'
    import CompanyTitle from './CompanyTitle.vue'
    import Logo from './Logo.vue'
    import ToolbarNav from './ToolbarNav.vue'

    export default {
        name: 'header-toolbar',
        components: {
            BurgerIcon,
            CompanyTitle,
            Logo,
            ToolbarNav
        },
        props: [],
        data: function () {
            return {}
        },
        computed: {
            ...mapGetters({
                mobileNavMenuActivated: 'mobileNavMenu/activated'
            }),
            dynamicClasses: function () {
                return {
                    'is-active': this.isOnMobileDevice && this.mobileNavMenuActivated
                }
            }
        },
        watch: {},
        methods: {
            ...mapMutations({
                register: 'viewport/register'
            }),
            ...mapActions({})
        },
        beforeCreate: function () { },
        created: function () { },
        beforeMount: function () { },
        mounted: function () {
            this.register({
                stateProperty: 'headerToolbarHeight',
                value: document.getElementById('header-toolbar').clientHeight
            })
        },
        beforeUpdate: function () { },
        updated: function () {
            this.register({
                stateProperty: 'headerToolbarHeight',
                value: document.getElementById('header-toolbar').clientHeight
            })
        },
        beforeDestroy: function () { },
        destroyed: function () { }
    }
</script>

<style scoped>
    header {
        position: fixed;
        width: 100%;
        top: 0;
        overflow-y: hidden;
        overflow-x: hidden;
        z-index: 10;
    }
</style>
