<template>
    <p class="control">
        <button class="button is-primary"
                @click="submit"
                :disabled="flowControl">
            <template v-if="!flowControl">
                <span v-if="validated">更新資料</span>
                <span v-else>產品資料不完整</span>
            </template>
            <template v-else>
                <span class="icon">
                    <i class="fa fa-spinner fa-pulse"></i>
                </span>
                <span>修改產品資料中...</span>
            </template>
        </button>
    </p>
</template>

<script>
    import Promise from 'bluebird'
    import { mapActions, mapGetters, mapMutations } from 'vuex'

    export default {
        name: 'update-button',
        components: {},
        props: [],
        data: function () {
            return {}
        },
        computed: {
            ...mapGetters({
                flowControl: 'flowControl/activated',
                validated: 'productData/form/validation/form',
                validating: 'productData/form/validation/state',
                formData: 'productData/form/formData'
            })
        },
        watch: {},
        methods: {
            ...mapMutations({
                activateValidation: 'productData/form/validation/activate',
                reset: 'productData/reset'
            }),
            ...mapActions({
                updateExistingProduct: 'updateExistingProduct'
            }),
            submit: function () {
                if (!this.validating) {
                    this.activateValidation()
                }
                if (this.validated) {
                    this.updateExistingProduct()
                        .then(() => {
                            alert('產品資料修改成功')
                            return Promise.resolve()
                        })
                        .catch((error) => {
                            alert('產品資料修改失敗')
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
