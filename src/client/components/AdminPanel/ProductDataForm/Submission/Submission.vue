<template>
    <div class="field is-grouped">
        <insert-button v-if="newEntry"></insert-button>
        <template v-else>
            <update-button></update-button>
            <delete-button></delete-button>
        </template>
        <reset-button></reset-button>
    </div>
</template>

<script>
    import { mapActions, mapGetters, mapMutations } from 'vuex'

    import InsertButton from './InsertButton.vue'
    import ResetButton from './ResetButton.vue'
    import DeleteButton from './DeleteButton.vue'
    import UpdateButton from './UpdateButton.vue'

    export default {
        name: 'submission',
        components: {
            InsertButton,
            ResetButton,
            DeleteButton,
            UpdateButton
        },
        props: [],
        data: function () {
            return {}
        },
        computed: {
            ...mapGetters({
                newEntry: 'productData/newEntry'
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

<style scoped></style>
