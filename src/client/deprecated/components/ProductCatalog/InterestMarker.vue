<template>
    <div class="interest-marker"
         :style="markerStyle"
         @click="register({productId:productId})">
        <span class="icon is-medium">
            <i class="fa fa-check-circle"></i>
        </span>
    </div>
</template>

<script>
    import { mapActions, mapGetters, mapMutations } from 'vuex'

    export default {
        name: 'interest-marker',
        components: {},
        props: [
            'productId'
        ],
        data: function () {
            return {}
        },
        computed: {
            ...mapGetters({
                'isInterested': 'interestedProducts/isInterested'
            }),
            markerStyle: function () {
                if (this.isInterested(this.productId)) {
                    return {
                        'background-color': 'rgba(255,255,255,0.4)',
                        color: 'darkorange'
                    }
                } else {
                    return {
                        'background-color': 'rgba(0,0,0,0.2)',
                        color: 'rgba(255,255,255,0.6)'
                    }
                }
            }
        },
        watch: {},
        methods: {
            ...mapMutations({
                register: 'interestedProducts/register'
            }),
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
    div.interest-marker {
        font-weight: bolder;
        padding: 0px;
        align-self: flex-start;
        margin-left: auto;
    }
</style>
