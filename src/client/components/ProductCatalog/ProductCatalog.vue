<template>
    <div class="hero-body">
        <interest-cart></interest-cart>
        <div class="container is-fluid">
            <div class="columns is-centered">
                <div class="column box">
                    <div class="notification has-text-centered">
                        <div class="columns is-centered">
                            <span class="title"
                                  :class="{'is-6':isOnMobileDevice,'is-1':!isOnMobileDevice}">
                                PRODUCT SERIES
                            </span>
                        </div>
                    </div>
                    <div class="card"
                         v-for="seriesItem in series"
                         :key="seriesItem.id">
                        <header class="card-header"
                                :class="{'is-active':seriesItem.id===activeSeriesId}"
                                @click="selectSeries(seriesItem.id)">
                            <p class="card-header-title">
                                <span :class="seriesTitleTextSize(seriesItem.id)"
                                      :style="{color:(activeSeriesId===seriesItem.id)?'white':'darkgreen'}">
                                    <i>{{seriesItem.reference.toUpperCase()}}</i>
                                    <i v-if="seriesItem.products.length">- {{seriesItem.products.length}} ITEM(S)</i>
                                </span>
                            </p>
                        </header>
                        <template v-if="(activeSeriesId===seriesItem.id)&&(seriesItem.products.length)">
                            <desktop-product-viewer v-if="!isMobile"
                                                    :products="seriesItem.products">
                            </desktop-product-viewer>
                            <mobile-product-viewer v-else
                                                   :products="seriesItem.products">
                            </mobile-product-viewer>
                        </template>
                    </div>
                </div>
            </div>
        </div>
        <br>
        <br>
        <br v-if="!isMobile">
    </div>
</template>

<script>
    import { mapActions, mapGetters, mapMutations } from 'vuex'

    import DesktopProductViewer from './DesktopProductViewer.vue'
    import MobileProductViewer from './MobileProductViewer.vue'
    import InterestCart from './InterestCart.vue'

    export default {
        name: 'product-catalog',
        components: {
            DesktopProductViewer,
            MobileProductViewer,
            InterestCart
        },
        props: [],
        data: function () {
            return {
                activeSeriesId: 0
            }
        },
        computed: {
            ...mapGetters({
                series: 'series/data',
                products: 'products/data'
            }),
            seriesTitleTextSize: function () {
                return (seriesId) => {
                    return {
                        'title is-2 is-active': (this.activeSeriesId === seriesId) && !this.isOnMobileDevice,
                        'title is-6 is-active': (this.activeSeriesId === seriesId) && this.isOnMobileDevice,
                        'title is-4': (this.activeSeriesId !== seriesId) && !this.isOnMobileDevice,
                        'title is-6': (this.activeSeriesId !== seriesId) && this.isOnMobileDevice
                    }
                }
            }
        },
        watch: {},
        methods: {
            ...mapMutations({}),
            ...mapActions({}),
            selectSeries: function (seriesId) {
                if ((this.series[seriesId].products.length > 0) && (this.activeSeriesId !== seriesId)) {
                    this.visibleColumnIndex = 1
                    this.activeSeriesId = seriesId
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

<style scoped>
    span.title,
    span.subtitle {
        font-style: italic;
        font-weight: bold;
        color: darkgreen;
    }

    header.card-header.is-active {
        background-color: darkorange;
    }

    header.card-header:hover .card-header-title {
        transform: scale(1.005);
    }
</style>
