<template>
    <div class="control">
        <button class="button is-primary"
                @click="submit"
                :disabled="flowControl">
            <template v-if="!flowControl">
                <span v-if="validated">登入</span>
                <span v-else>登入資料不完整</span>
            </template>
            <template v-else>
                <span class="icon">
                    <i class="fa fa-spinner fa-pulse"></i>
                </span>
                <span>帳號驗證中...</span>
            </template>
        </button>
    </div>
</template>

<script>
    import Promise from 'bluebird'
    import { mapActions, mapGetters, mapMutations } from 'vuex'

    export default {
        name: 'submit',
        components: {},
        props: [],
        data: function () {
            return {}
        },
        computed: {
            ...mapGetters({
                flowControl: 'flowControl/activated',
                validated: 'loginForm/validation/form',
                validating: 'loginForm/validation/state'
            })
        },
        watch: {},
        methods: {
            ...mapMutations({
                activateValidation: 'loginForm/validation/activate'
            }),
            ...mapActions({
                login: 'login'
            }),
            submit: function () {
                if (!this.validating) {
                    this.activateValidation()
                }
                if (this.validated) {
                    this.login()
                        .then(() => {
                            this.$router.replace('/productCatalog/admin')
                            return Promise.resolve()
                        })
                        .catch((error) => {
                            alert('登入失敗')
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
