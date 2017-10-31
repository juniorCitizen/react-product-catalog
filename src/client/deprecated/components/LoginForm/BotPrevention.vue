<template>
    <div class="field">
        <input class="input"
               name="bot-prevention"
               type="text"
               required
               :value="botPrevention"
               @input="updateValue">
    </div>
</template>

<script>
    import { mapActions, mapGetters, mapMutations } from 'vuex'

    export default {
        name: 'bot-prevention',
        components: {},
        props: [],
        data: function () {
            return {}
        },
        computed: {
            ...mapGetters({
                botPrevention: 'loginForm/botPrevention'
            })
        },
        watch: {},
        methods: {
            ...mapMutations({
                register: 'loginForm/register'
            }),
            ...mapActions({}),
            updateValue: function (event) {
                this.register({
                    name: 'botPrevention',
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

<style scoped>
    div {
        display: none;
    }
</style>
