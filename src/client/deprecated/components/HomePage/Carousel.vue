<template>
    <div class="carousel-viewport">
        <div class="carousel-container">
            <div class="carousel-slide"
                 :style="currentSlideStyle"></div>
            <div class="carousel-slide"
                 :style="nextSlideStyle"></div>
        </div>
    </div>
</template>

<script>
    import { mapActions, mapGetters, mapMutations } from 'vuex'

    export default {
        name: 'carousel',
        components: {},
        props: [],
        data: function () {
            return {
                apiUrl: `${this.$eVars.HOST}/${this.$eVars.SYS_REF}/assets/carousel`,
                currentSlideLeftPosition: 0,
                currentSlideIndex: 0,
                nextSlideLeftPosition: 100,
                nextSlideIndex: 1,
                photoSwitchFrequency: 5000,
                intervalHandle: null,
                photoFileList: null
            }
        },
        computed: {
            ...mapGetters({}),
            currentSlideStyle: function () {
                return {
                    left: this.currentSlideLeftPosition + '%',
                    // 'background-image': !this.photoFileList ? '' : `url(${this.apiUrl}?photoFileName=photo 1.jpg`
                    'background-image': !this.photoFileList ? '' : `url(${this.apiUrl}?photoFileName=${this.photoFileList[this.currentSlideIndex]})`
                }
            },
            nextSlideStyle: function () {
                return {
                    left: this.nextSlideLeftPosition + '%',
                    // 'background-image': !this.photoFileList ? '' : `url(${this.apiUrl}?photoFileName=photo 2.jpg`
                    'background-image': !this.photoFileList ? '' : `url(${this.apiUrl}?photoFileName=${this.photoFileList[this.nextSlideIndex]})`
                }
            },
            nextPhotoIndex: function () {
                if ((!this.photoFileList) || (this.currentSlideIndex === (this.photoFileList.length - 1))) {
                    return 0
                } else {
                    return (this.currentSlideIndex + 1)
                }
            },
            carouselSlideSpeed: function () {
                // return this.isMobile ? 3 : 0.5
                return 0.5
            }
        },
        watch: {},
        methods: {
            ...mapMutations({}),
            ...mapActions({}),
            slideAnimation: function () {
                let animationHandle = setInterval(() => {
                    this.currentSlideLeftPosition = this.currentSlideLeftPosition - this.carouselSlideSpeed
                    this.nextSlideLeftPosition = this.nextSlideLeftPosition - this.carouselSlideSpeed
                    if (this.currentSlideLeftPosition <= -100) {
                        clearInterval(animationHandle)
                        setTimeout(() => {
                            this.currentSlideIndex = this.nextSlideIndex
                            this.currentSlideLeftPosition = 0
                            this.nextSlideLeftPosition = 100
                            this.nextSlideIndex = this.nextPhotoIndex
                        }, 2)
                    }
                }, 1)
            }
        },
        beforeCreate: function () { },
        created: function () { },
        beforeMount: function () {
            this
                .$axios({
                    method: 'get',
                    url: `${this.apiUrl}/list`
                })
                .then((serverResponse) => {
                    this.photoFileList = serverResponse.data.data
                    this.currentSlideIndex = 0
                    this.nextSlideIndex = 1
                    return true
                })
                .catch((error) => {
                    console.log(error)
                })
        },
        mounted: function () {
            this.intervalHandle = setInterval(() => {
                this.slideAnimation()
            }, this.photoSwitchFrequency)
        },
        beforeUpdate: function () { },
        updated: function () { },
        beforeDestroy: function () {
            clearInterval(this.intervalHandle)
        },
        destroyed: function () { }
    }
</script>

<style scoped>
    .carousel-viewport {
        /* border: 1px solid red; */
        position: fixed;
        align-self: center;
        height: 85%;
        width: 99%;
        padding: 0px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .carousel-container {
        /* border: 1px solid green; */
        margin: 0px;
        padding: 0px;
        height: 100%;
        width: 100%;
        overflow-x: hidden;
        /* overflow-x: visible; */
        position: relative;
    }

    .carousel-slide {
        /* border: 1px solid black; */
        margin: 0px;
        padding: 0px;
        height: 100%;
        width: 100%;
        position: absolute;
        top: 0%;
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center;
    }
</style>
