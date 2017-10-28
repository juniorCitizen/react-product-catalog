<template>
    <div class="notification">
        <div class="columns">
            <div class="column is-2 has-text-centered">
                <photo-slide :photo="primaryPhoto[0]"
                             :photoIndex="0"
                             :ignored="false"
                             @photoClickEvent="removePrimaryPhoto($event)">
                </photo-slide>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapActions, mapGetters, mapMutations } from 'vuex'

    import PhotoSlide from './PhotoSlide.vue'

    export default {
        name: 'primary-photo-display',
        components: {
            PhotoSlide
        },
        props: [],
        data: function () {
            return {}
        },
        computed: {
            ...mapGetters({
                primaryPhoto: 'productData/form/primaryPhoto'
            })
        },
        watch: {},
        methods: {
            ...mapMutations({
                register: 'productData/form/register'
            }),
            ...mapActions({}),
            removePrimaryPhoto: function (photoIndex) {
                if (confirm('確認移除產品主要相片')) {
                    this.register({
                        name: 'primaryPhoto',
                        value: null
                    })
                }
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
