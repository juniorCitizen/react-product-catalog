<template>
    <p class="subtitle"
       :class="dynamicClass"
       :style="marginStyle"
       @click="$router.push('/productCatalog/products')">
        {{ captionText }}
    </p>
</template>

<script>
    import { mapActions, mapGetters, mapMutations } from 'vuex'

    export default {
        name: 'caption-text',
        components: {},
        props: [],
        data: function () {
            return {
                captionText: 'Available from Taiwan or China'
            }
        },
        computed: {
            ...mapGetters({}),
            dynamicClass: function () {
                return {
                    'is-5': !this.isOnMobileDevice,
                    'is-6': this.isOnMobileDevice
                }
            },
            marginStyle: function () {
                if (this.isMobile) {
                    return {
                        'margin-top': '30px'
                    }
                } else {
                    return {
                        'margin-top': '100px'
                    }
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
    p {
        color: white;
        cursor: pointer;
    }

    p:hover {
        text-decoration: underline;
        font-weight: bold;
    }
</style>
