<template>
    <div class="hero-body">
        <div class="container is-fluid">
            <div class="columns is-centered">
                <div class="column box">
                    <div class="notification has-text-centered">
                        <div class="columns is-centered">
                            <span class="title"
                                  :class="{'is-6':isOnMobileDevice,'is-1':!isOnMobileDevice}">
                                PRODUCT DETAILS
                            </span>
                        </div>
                    </div>
                    <div class="tile is-ancestor">
                        <div class="tile">
                            <div class="tile is-parent is-vertical">
                                <div class="photo-frame tile is-child box">
                                    <img class="image"
                                         :src="`${$eVars.API_URL}/photos?photoId=e0a044cc-e9ca-4127-9ed1-16a913fd26c2`">
                                </div>
                                <div class="tile is-child">
                                    <div class="columns">
                                        <div class="column is-narrow">
                                            left
                                        </div>
                                        <div class="column">
                                            <div class="columns">
                                                <div class="column">
                                                    <img class="image"
                                                         :src="`${$eVars.API_URL}/photos?photoId=e81ac868-01bb-4015-9d51-fd35c0f9f5fe`">
                                                </div>
                                                <div class="column">
                                                    <img class="image"
                                                         :src="`${$eVars.API_URL}/photos?photoId=b21e01dc-f219-4a2d-93ce-296c55e073f5`">
                                                </div>
                                                <div class="column">
                                                    <img class="image"
                                                         :src="`${$eVars.API_URL}/photos?photoId=1332f46f-e145-4ae9-a4d5-1d8ebae98ece`">
                                                </div>
                                                <div class="column">
                                                    <img class="image"
                                                         :src="`${$eVars.API_URL}/photos?photoId=1332f46f-e145-4ae9-a4d5-1d8ebae98ece`">
                                                </div>
                                                <div class="column">
                                                    <img class="image"
                                                         :src="`${$eVars.API_URL}/photos?photoId=b21e01dc-f219-4a2d-93ce-296c55e073f5`">
                                                </div>
                                                <div class="column">
                                                    <img class="image"
                                                         :src="`${$eVars.API_URL}/photos?photoId=1332f46f-e145-4ae9-a4d5-1d8ebae98ece`">
                                                </div>
                                            </div>
                                        </div>
                                        <div class="column is-narrow">
                                            right
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="tile is-parent is-vertical">
                                <div class="columns">
                                    <div class="column">INFORMATION</div>
                                    <div class="column">
                                        <ul>
                                            <li>
                                                MODEL GT-1012T
                                            </li>
                                            <li>
                                                NAME GT-1012T
                                            </li>
                                            <li>
                                                DESCRIPTION GT-1012T
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div class="columns">
                                    <div class="column">SPECIFICATIONS</div>
                                </div>
                                <div class="columns">
                                    <div class="column is-2">MODEL</div>
                                    <div class="column">GT-1012T</div>
                                </div>
                                <div class="columns">
                                    <div class="column is-2">NAME</div>
                                    <div class="column">ALUMINIUM CRUTCHES FOR TALL ADULTS</div>
                                </div>
                                <div class="columns">
                                    <div class="column is-2">DESCRIPTION</div>
                                    <p class="column">
                                        dvzdfa
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapActions, mapGetters, mapMutations } from 'vuex'

    export default {
        name: 'product-details',
        components: {},
        props: [
            'productId'
        ],
        data: function () {
            return {}
        },
        computed: {
            ...mapGetters({
                products: 'products'
            })
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
    span.title,
    span.subtitle {
        font-style: italic;
        font-weight: bold;
        color: darkgreen;
    }

    .photo-frame {
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>
