<template>
    <div class="control"
         :class="{'has-icons-left':warning}">
        <div class="select"
             :class="{'is-danger':warning}">
            <select :value="type"
                    @change="updateValue"
                    :disabled="!newEntry">
                <option value="unselected"
                        disabled
                        selected>
                    產品類別 (必選)
                </option>
                <option value="product">產品</option>
                <option value="accessory">配件</option>
            </select>
            <div v-if="warning"
                 class="icon is-left">
                <i class="fa fa-times"></i>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapActions, mapGetters, mapMutations } from 'vuex'

    export default {
        name: 'product-type',
        components: {},
        props: [],
        data: function () {
            return {}
        },
        computed: {
            ...mapGetters({
                type: 'productData/form/type',
                flowControl: 'flowControl/activated',
                validated: 'productData/form/validation/input',
                validating: 'productData/form/validation/state',
                newEntry: 'productData/newEntry'
            }),
            warning: function () {
                return !this.validated('type') && this.validating
            }
        },
        watch: {},
        methods: {
            ...mapMutations({
                register: 'productData/form/register'
            }),
            ...mapActions({}),
            updateValue: function (event) {
                this.register({
                    name: 'type',
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
