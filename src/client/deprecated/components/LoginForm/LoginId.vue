<template>
    <div class="field">
        <div class="control has-icons-left">
            <input class="input"
                   type="text"
                   placeholder="使用者帳號"
                   :class="{'is-danger':warning}"
                   :value="loginId"
                   @input="updateValue"
                   :disabled="flowControl">
            <span class="icon is-left">
                <i class="fa fa-user"></i>
            </span>
        </div>
        <p v-if="warning"
           class="help is-danger">
            使用者帳號為必塡項目
        </p>
    </div>
</template>

<script>
    import { mapActions, mapGetters, mapMutations } from 'vuex'

    export default {
        name: 'login-id',
        components: {},
        props: [],
        data: function () {
            return {}
        },
        computed: {
            ...mapGetters({
                loginId: 'loginForm/loginId',
                flowControl: 'flowControl/activated',
                validated: 'loginForm/validation/input',
                validating: 'loginForm/validation/state'
            }),
            warning: function () {
                return !this.validated('loginId') && this.validating
            }
        },
        watch: {},
        methods: {
            ...mapMutations({
                register: 'loginForm/register'
            }),
            ...mapActions({}),
            updateValue: function (event) {
                this.register({
                    name: 'loginId',
                    value: event.target.value
                })
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
