<template>
    <p class="control">
        <button class="button is-danger"
                @click="deleteProductRecord"
                :disabled="flowControl">
            <template v-if="!flowControl">
                <span>刪除資料</span>
            </template>
            <template v-else>
                <span class="icon">
                    <i class="fa fa-spinner fa-pulse"></i>
                </span>
                <span>刪除產品資料...</span>
            </template>
        </button>
    </p>
</template>

<script>
    import Promise from 'bluebird'
    import { mapActions, mapGetters, mapMutations } from 'vuex'

    export default {
        name: 'delete-button',
        components: {},
        props: [],
        data: function () {
            return {}
        },
        computed: {
            ...mapGetters({
                flowControl: 'flowControl/activated',
                updateTargetRecordId: 'productData/updateTargetRecordId'
            })
        },
        watch: {},
        methods: {
            ...mapMutations({
                reset: 'productData/reset'
            }),
            ...mapActions({}),
            deleteProductRecord: function () {
                if (confirm('確認刪除產品資料')) {
                    this.$store.dispatch('deleteProductRecord', this.updateTargetRecordId)
                        .then(() => {
                            alert('產品資料刪除成功')
                            return Promise.resolve()
                        })
                        .catch((error) => {
                            alert('產品資料刪除失敗')
                            console.log(error.name)
                            console.log(error.message)
                            console.log(error.stack)
                        })
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
