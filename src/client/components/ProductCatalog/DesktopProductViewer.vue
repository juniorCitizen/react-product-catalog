<template>
    <div class="card-content">
        <div class="content columns"
             :style="{height:height+'px'}">
            <div class="cycle-control column is-narrow"
                 @click="triggerEnterFromLeft()">
                <span class="icon is-large">
                    <i class="fa fa-chevron-left"></i>
                </span>
            </div>
            <v-touch :style="swiperStyles"
                     @swipeleft.capture="triggerEnterFromRight()"
                     @swiperight.capture="triggerEnterFromLeft()">
                <div id="product-viewport"
                     class="column">
                    <div id="slide-wrapper"
                         :style="{left:photoSetLeftPosition+'px'}">
                        <div class="multi-product-slide">
                            <template v-for="(product,productIndex) in previousProductSet">
                                <div v-if="product.id"
                                     class="product-wrapper"
                                     :key="productIndex"
                                     :style="productWrapperStyle(`${$eVars.API_URL}/photos?photoId=${product.photos[0].id}`)">
                                    <div class="product-code-label">
                                        ({{(previousColumnIndex*productsPerRow)+productIndex+1}}) {{product.code}}
                                    </div>
                                    <interest-marker :productId="product.id"></interest-marker>
                                </div>
                                <div v-else
                                     class="product-wrapper placeholder"
                                     :style="productWrapperStyle()"
                                     :key="productIndex">
                                </div>
                            </template>
                        </div>
                        <div class="multi-product-slide">
                            <template v-for="(product,productIndex) in visibleProductSet">
                                <div v-if="product.id"
                                     class="product-wrapper"
                                     :key="productIndex"
                                     :style="productWrapperStyle(`${$eVars.API_URL}/photos?photoId=${product.photos[0].id}`)">
                                    <div class="product-code-label">
                                        ({{(visibleColumnIndex*productsPerRow)+productIndex+1}}) {{product.code}}
                                    </div>
                                    <interest-marker :productId="product.id"></interest-marker>
                                </div>
                                <div v-else
                                     class="product-wrapper placeholder"
                                     :style="productWrapperStyle()"
                                     :key="productIndex">
                                </div>
                            </template>
                        </div>
                        <div class="multi-product-slide">
                            <template v-for="(product,productIndex) in nextProductSet">
                                <div v-if="product.id"
                                     class="product-wrapper"
                                     :key="productIndex"
                                     :style="productWrapperStyle(`${$eVars.API_URL}/photos?photoId=${product.photos[0].id}`)">
                                    <div class="product-code-label">
                                        ({{(visibleColumnIndex*productsPerRow)+productIndex+1}}) {{product.code}}
                                    </div>
                                    <interest-marker :productId="product.id"></interest-marker>
                                </div>
                                <div v-else
                                     class="product-wrapper placeholder"
                                     :style="productWrapperStyle()"
                                     :key="productIndex">
                                </div>
                            </template>
                        </div>
                    </div>
                </div>
            </v-touch>
            <div class="cycle-control column is-narrow"
                 @click="triggerEnterFromRight()">
                <span class="icon is-large">
                    <i class="fa fa-chevron-right"></i>
                </span>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapActions, mapGetters, mapMutations } from 'vuex'

    import InterestMarker from './InterestMarker.vue'

    export default {
        name: 'desktop-product-viewer',
        components: {
            InterestMarker
        },
        props: [
            'products'
        ],
        data: function () {
            return {
                height: 350,
                productsPerRow: 4,
                visibleColumnIndex: 0,
                enterFromLeft: false,
                enterFromRight: false,
                productViewportWidth: 0,
                photoSetLeftPosition: 0
            }
        },
        computed: {
            ...mapGetters({}),
            columnCount: function () {
                return this.products.length === 0 ? 0 : Math.ceil(this.products.length / this.productsPerRow)
            },
            previousColumnIndex: function () {
                return (this.visibleColumnIndex === 0) ? (this.columnCount - 1) : (this.visibleColumnIndex - 1)
            },
            previousProductSet: function () {
                let upperLimit = ((this.previousColumnIndex + 1) * this.productsPerRow) - 1
                let lowerLimit = upperLimit - (this.productsPerRow - 1)
                let filteredList = this.products.filter((product, productIndex) => {
                    return (productIndex >= lowerLimit) && (productIndex <= upperLimit)
                })
                for (let counter = filteredList.length; counter < this.productsPerRow; counter++) {
                    filteredList.push({})
                }
                return filteredList
            },
            visibleProductSet: function () {
                let upperLimit = ((this.visibleColumnIndex + 1) * this.productsPerRow) - 1
                let lowerLimit = upperLimit - (this.productsPerRow - 1)
                let filteredList = this.products.filter((product, productIndex) => {
                    return (productIndex >= lowerLimit) && (productIndex <= upperLimit)
                })
                for (let counter = filteredList.length; counter < this.productsPerRow; counter++) {
                    filteredList.push({})
                }
                return filteredList
            },
            emptyView: function () {
                let upperLimit = ((this.visibleColumnIndex + 1) * this.productsPerRow) - 1
                let lowerLimit = upperLimit - (this.productsPerRow - 1)
                let filteredList = this.products.filter((product, productIndex) => {
                    return (productIndex >= lowerLimit) && (productIndex <= upperLimit)
                })
                return filteredList.length === 0
            },
            nextColumnIndex: function () {
                return (this.visibleColumnIndex === this.columnCount - 1) ? 0 : (this.visibleColumnIndex + 1)
            },
            nextProductSet: function () {
                let upperLimit = ((this.nextColumnIndex + 1) * this.productsPerRow) - 1
                let lowerLimit = upperLimit - (this.productsPerRow - 1)
                let filteredList = this.products.filter((product, productIndex) => {
                    return (productIndex >= lowerLimit) && (productIndex <= upperLimit)
                })
                for (let counter = filteredList.length; counter < this.productsPerRow; counter++) {
                    filteredList.push({})
                }
                return filteredList
            },
            swiperStyles: function () {
                return {
                    display: 'flex',
                    padding: '0px',
                    margin: '0px',
                    height: '100%',
                    width: '100%'
                }
            },
            sliderSpeed: function () {
                return Math.ceil(this.productViewportWidth / 120)
            },
            accordianSpeed: function () {
                return 15
            }
        },
        watch: {
            emptyView: function (state) {
                if (state) {
                    this.visibleColumnIndex--
                }
            },
            isFullhd: function (state) {
                if (state) {
                    this.productsPerRow = 4
                    this.accordianAnimation(this.height, 350)
                }
            },
            isWidescreenOnly: function (state) {
                if (state) {
                    this.productsPerRow = 3
                    this.accordianAnimation(this.height, 300)
                }
            },
            isDesktopOnly: function (state) {
                if (state) {
                    this.productsPerRow = 4
                    this.accordianAnimation(this.height, 250)
                }
            },
            isTabletOnly: function (state) {
                if (state) {
                    this.productsPerRow = 3
                    this.accordianAnimation(this.height, 200)
                }
            },
            isMobile: function (state) {
                if (state) {
                    this.productsPerRow = 1
                    this.accordianAnimation(this.height, 200)
                }
            },
            enterFromLeft: function (activationState) {
                if (activationState && (this.columnCount > 1)) {
                    let animateCounter = setInterval(() => {
                        this.photoSetLeftPosition = this.photoSetLeftPosition + this.sliderSpeed
                        if (this.photoSetLeftPosition >= 0) {
                            clearInterval(animateCounter)
                            this.enterFromLeft = false
                            if (this.visibleColumnIndex === 0) {
                                this.visibleColumnIndex = this.columnCount - 1
                            } else {
                                this.visibleColumnIndex--
                            }
                            this.photoSetLeftPosition = this.productViewportWidth * -1
                        }
                    }, 1)
                }
            },
            enterFromRight: function (activationState) {
                if (activationState && (this.columnCount > 1)) {
                    let animateCounter = setInterval(() => {
                        this.photoSetLeftPosition = this.photoSetLeftPosition - this.sliderSpeed
                        if (this.photoSetLeftPosition <= this.productViewportWidth * -2) {
                            clearInterval(animateCounter)
                            this.enterFromRight = false
                            if (this.visibleColumnIndex === this.columnCount - 1) {
                                this.visibleColumnIndex = 0
                            } else {
                                this.visibleColumnIndex++
                            }
                            this.photoSetLeftPosition = this.productViewportWidth * -1
                        }
                    }, 1)
                }
            }
        },
        methods: {
            ...mapMutations({}),
            ...mapActions({}),
            productWrapperStyle: function (src) {
                let width = (((1 / this.productsPerRow) * 100) - 2) + '%'
                if (src) {
                    return {
                        width: width,
                        'background-image': `url(${src})`,
                        'background-size': 'contain',
                        'background-repeat': 'no-repeat',
                        'background-position': 'center'
                    }
                } else {
                    return {
                        width: width
                    }
                }
            },
            registerProductViewportWidth: function () {
                this.productViewportWidth = document.getElementById('product-viewport').clientWidth
                this.photoSetLeftPosition = this.productViewportWidth * -1
            },
            accordianAnimation: function (initialHeight, targetHeight) {
                if (initialHeight !== targetHeight) {
                    this.height = initialHeight
                    if (initialHeight < targetHeight) {
                        let animationTimer = setInterval(() => {
                            this.height = this.height + this.accordianSpeed
                            if (this.height >= targetHeight) {
                                clearInterval(animationTimer)
                            }
                        }, 10)
                    } else {
                        let animationTimer = setInterval(() => {
                            this.height = this.height - this.accordianSpeed
                            if (this.height <= targetHeight) {
                                clearInterval(animationTimer)
                            }
                        }, 10)
                    }
                }
            },
            triggerEnterFromLeft: function () {
                if (!this.enterFromLeft && !this.enterFromRight) {
                    this.enterFromLeft = true
                }
            },
            triggerEnterFromRight: function () {
                if (!this.enterFromLeft && !this.enterFromRight) {
                    this.enterFromRight = true
                }
            }
        },
        beforeCreate: function () { },
        created: function () { },
        beforeMount: function () { },
        mounted: function () {
            this.$nextTick(() => {
                window.addEventListener('resize', this.registerProductViewportWidth)
                this.registerProductViewportWidth()
                if (this.isFullhd) {
                    this.productsPerRow = 4
                    this.accordianAnimation(0, 350)
                } else if (this.isWidescreenOnly) {
                    this.productsPerRow = 3
                    this.accordianAnimation(0, 300)
                } else if (this.isDesktopOnly) {
                    this.productsPerRow = 4
                    this.accordianAnimation(0, 250)
                } else if (this.isTabletOnly) {
                    this.productsPerRow = 3
                    this.accordianAnimation(0, 200)
                } else {
                    this.productsPerRow = 1
                    this.accordianAnimation(0, 200)
                }
            })
        },
        beforeUpdate: function () { },
        updated: function () { },
        beforeDestroy: function () {
            window.removeEventListener('resize', this.registerProductViewportWidth)
        },
        destroyed: function () { }
    }
</script>

<style scoped>
    div.card-content {
        padding: 0;
    }

    div.content {
        margin: 0;
        padding: 0;
    }

    div#product-viewport {
        /* border: 1px solid red; */
        margin: 0;
        padding: 0;
        display: flex;
        align-items: center;
        position: relative;
        overflow-x: hidden;
    }

    div#slide-wrapper {
        /* border: 1px solid blue; */
        height: 100%;
        width: 300%;
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    div.multi-product-slide {
        /* border: 1px solid green; */
        height: 100%;
        width: 33.33%;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    div.product-wrapper {
        /* border: 1px solid red; */
        height: 85%;
        display: flex;
    }

    div.product-wrapper:not(.placeholder):hover {
        box-shadow: inset 0px 0px 5px 5px orange;
    }

    div.product-code-label {
        color: white;
        background-color: rgba(0, 0, 0, 0.5);
        padding: 0px 5px 0px 5px;
        align-self: flex-end;
    }

    div.cycle-control {
        color: darkgreen;
        margin: 0px;
        padding: 0px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    i.fa-chevron-right:hover {
        animation: shift-to-right 1.5s infinite ease-in-out;
    }

    @keyframes shift-to-right {
        0% {
            transform: scale(1) translateX(0);
        }
        50% {
            transform: scale(1.1) translateX(5px);
        }
        100% {
            transform: scale(1) translateX(0);
        }
    }

    i.fa-chevron-left:hover {
        animation: shift-to-left 1.5s infinite ease-in-out;
    }

    @keyframes shift-to-left {
        0% {
            transform: scale(1) translateX(0);
        }
        50% {
            transform: scale(1.1) translateX(-5px);
        }
        100% {
            transform: scale(1) translateX(0);
        }
    }
</style>
