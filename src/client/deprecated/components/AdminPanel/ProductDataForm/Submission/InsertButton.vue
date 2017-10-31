<template>
    <p class="control">
        <button class="button is-primary"
                @click="submit"
                :disabled="flowControl">
            <template v-if="!flowControl">
                <span v-if="validated">建立資料</span>
                <span v-else>產品資料不完整</span>
            </template>
            <template v-else>
                <span class="icon">
                    <i class="fa fa-spinner fa-pulse"></i>
                </span>
                <span>新產品資料建立中...</span>
            </template>
        </button>
    </p>
</template>

<script>
    import { mapActions, mapGetters, mapMutations } from 'vuex'

    export default {
        name: 'insert-button',
        components: {},
        props: [],
        data: function () {
            return {}
        },
        computed: {
            ...mapGetters({
                flowControl: 'flowControl/activated',
                validated: 'productData/form/validation/form',
                validating: 'productData/form/validation/state'
            })
        },
        watch: {},
        methods: {
            ...mapMutations({
                activateValidation: 'productData/form/validation/activate',
                reset: 'productData/reset'
            }),
            ...mapActions({
                registerNewProduct: 'registerNewProduct'
            }),
            submit: function () {
                if (!this.validating) {
                    this.activateValidation()
                }
                if (this.validated) {
                    this.registerNewProduct()
                        .then(() => {
                            return alert('新產品資料建立成功')
                        })
                        .catch((error) => {
                            alert('產品資料建立失敗')
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
