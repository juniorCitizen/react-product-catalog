<template>
    <div class="hero-body">
        <carousel></carousel>
        <div class="container is-fluid has-text-centered">
            <div class="tile is-ancestor">
                <div class="title-background tile is-parent is-vertical">
                    <div class="tile is-child">
                        <head-lines></head-lines>
                    </div>
                    <div class="tile is-child">
                        <subheadings></subheadings>
                    </div>
                    <div class="tile is-child">
                        <caption-text></caption-text>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapActions, mapGetters, mapMutations } from 'vuex'

    import HeadLines from './HeadLines.vue'
    import Subheadings from './Subheadings.vue'
    import CaptionText from './CaptionText.vue'
    import Carousel from './Carousel.vue'

    export default {
        name: 'home-page',
        components: {
            HeadLines,
            Subheadings,
            CaptionText,
            Carousel
        },
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
    div.hero-body {
        z-index: 0;
        justify-content: center;
        animation: animate 0.6s both;
    }

    @keyframes animate {
        0% {
            transform: scale(0.6) translateY(60px);
        }
        100% {
            transform: scale(1) translateY(0px);
        }
    }

    div.title-background {
        background-color: rgba(0%, 0%, 0%, 0.3);
    }
</style>
