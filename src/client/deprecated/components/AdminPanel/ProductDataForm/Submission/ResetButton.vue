<template>
    <p class="control">
        <button class="button is-danger"
                @click="handleReset"
                :disabled="flowControl">
            <span>表單重設</span>
        </button>
    </p>
</template>

<script>
    import { mapActions, mapGetters, mapMutations } from 'vuex'

    export default {
        name: 'reset-button',
        components: {},
        props: [],
        data: function () {
            return {}
        },
        computed: {
            ...mapGetters({
                flowControl: 'flowControl/activated'
            })
        },
        watch: {},
        methods: {
            ...mapMutations({
                reset: 'productData/reset'
            }),
            ...mapActions({}),
            handleReset: function () {
                if (confirm('請確認重置表單資料')) {
                    this.reset()
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

