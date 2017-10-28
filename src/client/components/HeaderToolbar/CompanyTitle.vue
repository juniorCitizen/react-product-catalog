<template>
    <span class="navbar-item">
        <span class="title is-5">
            <b>Gentry Way Co., Ltd.</b>
        </span>
    </span>
</template>

<script>
    import { mapActions, mapGetters, mapMutations } from 'vuex'

    export default {
        name: 'company-title',
        components: {},
        props: [],
        data: function () {
            return {}
        },
        computed: {
            ...mapGetters({})
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
    b {
        color: darkgreen;
        font-style: italic;
        margin-top: auto;
        margin-bottom: auto;
        cursor: default;
    }
</style>
