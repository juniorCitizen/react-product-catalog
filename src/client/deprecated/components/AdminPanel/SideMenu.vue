<template>
    <aside class="menu box">
        <p class="menu-label">
            <a @click="logout">登出</a>
        </p>
        <p class="menu-label">
            <a>產品系列</a>
        </p>
        <ul v-if="series.length>0"
            class="menu-list">
            <li v-for="(seriesItem,seriesIndex) in series"
                :key="seriesIndex">
                <a @click="toggleMenu(seriesItem.id)">
                    {{seriesItem.reference}}
                </a>
                <ul v-if="(seriesItem.products.length>0)&&(seriesItem.id===activeSeriesIndex)"
                    class="menu-list">
                    <li v-for="product in seriesItem.products"
                        :key="product.code">
                        <a @click="updateRecord(product)">
                            {{product.code}}
                        </a>
                    </li>
                </ul>
            </li>
        </ul>
    </aside>
</template>

<script>
    import { mapActions, mapGetters, mapMutations } from 'vuex'

    export default {
        name: 'side-menu',
        components: {},
        props: [],
        data: function () {
            return {}
        },
        computed: {
            ...mapGetters({
                series: 'series/data',
                activeSeriesIndex: 'series/activeSeriesIndex',
                flowControl: 'flowControl/activated'
            })
        },
        watch: {},
        methods: {
            ...mapMutations({
                toggleMenu: 'series/toggleMenu'
            }),
            ...mapActions({}),
            updateRecord: function (productData) {
                if (!this.flowControl) {
                    this.$store.commit('productData/updateRecord', productData)
                }
            },
            logout: function () {
                if (!this.flowControl) {
                    this.$store.commit('credentials/logout')
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
