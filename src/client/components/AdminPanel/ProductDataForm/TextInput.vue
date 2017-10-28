<template>
    <div class="field">
        <div class="control has-icons-right">
            <slot>
                placeholder for {{ inputReference }}
            </slot>
            <span v-if="pass"
                  class="icon is-right">
                <i class="fa fa-check"></i>
            </span>
            <span v-if="warning"
                  class="icon is-right">
                <i class="fa fa-times"></i>
            </span>
        </div>
    </div>
</template>

<script>
    import { mapActions, mapGetters, mapMutations } from 'vuex'

    export default {
        name: 'text-input',
        components: {},
        props: [
            'inputReference'
        ],
        data: function () {
            return {}
        },
        computed: {
            ...mapGetters({
                flowControl: 'flowControl/activated',
                validated: 'productData/form/validation/input',
                validating: 'productData/form/validation/state'
            }),
            pass: function () {
                return this.validated(this.inputReference) && this.validating
            },
            warning: function () {
                return !this.validated(this.inputReference) && this.validating
            }
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
