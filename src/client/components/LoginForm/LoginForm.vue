<template>
    <div class="hero-body">
        <div class="container is-fluid">
            <div v-if="!isOnMobileDevice"
                 class="columns is-centered">
                <div class="column is-4 box">
                    <div class="notification has-text-centered">
                        登入系統管理介面
                    </div>
                    <email></email>
                    <login-id></login-id>
                    <password></password>
                    <bot-prevention></bot-prevention>
                    <div class="field is-grouped">
                        <submit></submit>
                        <reset></reset>
                    </div>
                </div>
            </div>
            <div v-else
                 class="columns is-centered">
                <div class="column has-text-centered">不支援行動裝置解析度</div>
                <div class="column has-text-centered">Mobile Device is Unsupported</div>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapActions, mapGetters, mapMutations } from 'vuex'

    import Email from './Email.vue'
    import LoginId from './LoginId.vue'
    import Password from './Password.vue'
    import BotPrevention from './BotPrevention.vue'
    import Submit from './Submit.vue'
    import Reset from './Reset.vue'

    export default {
        name: 'login-form',
        components: {
            Email,
            LoginId,
            Password,
            BotPrevention,
            Submit,
            Reset
        },
        props: [],
        data: function () {
            return {}
        },
        computed: {
            ...mapGetters({})
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
