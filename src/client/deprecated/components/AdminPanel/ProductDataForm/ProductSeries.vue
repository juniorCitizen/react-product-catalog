<template>
    <div class="control"
         :class="{'has-icons-left':warning}">
        <div class="select"
             :class="{'is-danger':warning}">
            <select :value="seriesId"
                    @change="updateValue"
                    :disabled="!newEntry">
                <option value="-1"
                        disabled
                        selected>
                    產品系列 (必選)
                </option>
                <option v-for="seriesItem in series"
                        :key="seriesItem.id"
                        :value="seriesItem.id">
                    {{ seriesItem.reference }} 系列
                </option>
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
        name: 'product-series',
        components: {},
        props: [],
        data: function () {
            return {}
        },
        computed: {
            ...mapGetters({
                series: 'series/data',
                seriesId: 'productData/form/seriesId',
                flowControl: 'flowControl/activated',
                validated: 'productData/form/validation/input',
                validating: 'productData/form/validation/state',
                newEntry: 'productData/newEntry'
            }),
            warning: function () {
                return !this.validated('seriesId') && this.validating
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
                    name: 'seriesId',
                    value: parseInt(event.target.value)
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
