<template>
    <span class="navbar-item">
        <img class="image"
             :src="`${$eVars.CLIENT_URL}/assets/gentryLogoSmall.png`"
             alt="Gentry Way Co., Ltd.">
    </span>
</template>

<script>
    import { mapActions, mapGetters, mapMutations } from 'vuex'

    export default {
        name: 'logo',
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

<style scoped></style>
