<template>
    <div class="field">
        <div class="control has-icons-left">
            <input class="input"
                   type="email"
                   placeholder="電子郵件"
                   :class="{'is-danger':warning}"
                   :value="email"
                   @input="updateValue"
                   :disabled="flowControl">
            <span class="icon is-left">
                <i class="fa fa-envelope"></i>
            </span>
        </div>
        <p v-if="warning"
           class="help is-danger">
            未輸入電子郵件或格式錯誤
        </p>
    </div>
</template>

<script>
    import { mapActions, mapGetters, mapMutations } from 'vuex'

    export default {
        name: 'email',
        components: {},
        props: [],
        data: function () {
            return {}
        },
        computed: {
            ...mapGetters({
                email: 'loginForm/email',
                flowControl: 'flowControl/activated',
                validated: 'loginForm/validation/input',
                validating: 'loginForm/validation/state'
            }),
            warning: function () {
                return !this.validated('email') && this.validating
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
                    name: 'email',
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
