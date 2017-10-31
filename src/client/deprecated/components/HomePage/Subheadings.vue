<template>
    <p class="subtitle"
       :class="dynamicClass">
        <template v-for="(mottoLine,arrayIndex) in mottoText">
            <span :key="arrayIndex">
                {{ mottoLine }}
            </span>
            <br :key="arrayIndex"
                v-if="arrayIndex<=mottoText.length">
        </template>
    </p>
</template>

<script>
    import { mapActions, mapGetters, mapMutations } from 'vuex'

    export default {
        name: 'subheadings',
        components: {},
        props: [],
        data: function () {
            return {
                mottoText: [
                    'Quality aluminium extrusion products',
                    'for medical, rehabilitation and recreation industries',
                    'at competitive prices !!!'
                ]
            }
        },
        computed: {
            ...mapGetters({})
        },
        watch: {},
        methods: {
            ...mapMutations({}),
            ...mapActions({}),
            dynamicClass: function () {
                return {
                    'is-3': !this.isOnMobileDevice,
                    'is-6': this.isOnMobileDevice
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
    .subtitle {
        color: white;
        font-weight: bold;
        font-style: italic;
        transform: rotate(-4deg)
    }
</style>
