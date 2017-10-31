<template>
    <div class="column is-narrow"
         :class="dynamicClassBindinga">
        <small>© Copyright {{ new Date().getFullYear() }} Gentry Way Co., Ltd.</small>
    </div>
</template>

<script>
    import { mapActions, mapGetters, mapMutations } from 'vuex'

    export default {
        name: 'copyright-notice',
        components: {},
        props: [],
        data: function () {
            return {}
        },
        computed: {
            ...mapGetters({}),
            dynamicClassBindinga: function () {
                return {
                    'has-text-right': !this.isMobile,
                    'has-text-centered': this.isMobile
                }
            }
        },
        watch: {},
        methods: {
            ...mapMutations({}),
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
    div {
        padding-right: 0;
        font-size: 75%;
        color: darkgreen;
        cursor: default;
    }
</style>
