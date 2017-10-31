<template>
    <p class="title is-spaced"
       :class="dynamicClass">
        <template v-for="(officeLocation,arrayIndex) in officeLocations">
            <span :key="officeLocation.id">
                {{ officeLocation.title}}
            </span>
            <span :key="officeLocation.id"
                  v-if="arrayIndex<(officeLocations.length-1)">&</span>
            <br :key="officeLocation.id"
                v-if="arrayIndex<(officeLocations.length-1)">
        </template>
    </p>
</template>

<script>
    import { mapActions, mapGetters, mapMutations } from 'vuex'

    export default {
        name: 'head-lines',
        components: {},
        props: [],
        data: function () {
            return {}
        },
        computed: {
            ...mapGetters({
                officeLocations: 'officeLocations/data'
            }),
            dynamicClass: function () {
                return {
                    'is-1': !this.isOnMobileDevice,
                    'is-3': this.isOnMobileDevice && !this.isMobile,
                    'is-6': this.isMobile
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
    .title {
        color: white;
        font-weight: bold;
        font-style: italic;
        transform: rotate(-4deg)
    }
</style>
