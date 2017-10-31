<template>
    <div class="field">
        <div class="control has-icons-left">
            <input class="input"
                   type="password"
                   placeholder="登入密碼"
                   :class="{'is-danger':warning}"
                   :value="password"
                   @input="updateValue"
                   :disabled="flowControl">
            <span class="icon is-left">
                <i class="fa fa-key"></i>
            </span>
        </div>
        <p v-if="warning"
           class="help is-danger">
            登入密碼為必塡項目
        </p>
    </div>
</template>

<script>
    import { mapActions, mapGetters, mapMutations } from 'vuex'

    export default {
        name: 'password',
        components: {},
        props: [],
        data: function () {
            return {}
        },
        computed: {
            ...mapGetters({
                password: 'loginForm/password',
                flowControl: 'flowControl/activated',
                validated: 'loginForm/validation/input',
                validating: 'loginForm/validation/state'
            }),
            warning: function () {
                return !this.validated('password') && this.validating
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
                    name: 'password',
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
