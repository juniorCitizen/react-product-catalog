<template>
    <div class="control"
         :class="{animate:animate}"
         @click.capture="handleClick">
        <div class="tags has-addons">
            <span v-if="itemCount===0"
                  class="tag is-info"
                  :class="sizeClass">
                select&nbsp;
                <span class="icon is-large">
                    <i class="fa fa-check-circle"></i>
                </span>
                &nbsp;items that interests you
            </span>
            <span v-else
                  class="tag is-warning"
                  :class="sizeClass">
                <b>items of interest</b>
            </span>
            <span v-if="itemCount>0"
                  class="tag is-dark"
                  :class="sizeClass">
                <b>{{itemCount}}</b>
            </span>
        </div>
    </div>
</template>

<script>
    import { mapActions, mapGetters, mapMutations } from 'vuex'

    export default {
        name: 'interest-cart',
        components: {},
        props: [],
        data: function () {
            return {}
        },
        computed: {
            ...mapGetters({
                itemCount: 'interestedProducts/itemCount'
            }),
            sizeClass: function () {
                return {
                    'is-small': this.isMobile,
                    'is-large': !this.isMobile
                }
            },
            animate: function () {
                return this.itemCount > 0
            }
        },
        watch: {},
        methods: {
            ...mapMutations({}),
            ...mapActions({}),
            handleClick: function () {
                if (this.itemCount > 0) {
                    if (confirm('Authorize Gentry staff to contact you about these items of interest')) {
                        this.$router.push('register')
                    }
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

<style scoped>
    span.icon {
        color: darkorange;
    }

    div.control {
        position: fixed;
        bottom: 5%;
        right: 3%;
        cursor: pointer;
        z-index: 1000;
    }

    div.control.animate {
        animation: contractions 4s infinite ease-in-out;
    }

    @keyframes contractions {
        0% {
            transform: scale(1.0);
        }
        25% {
            transform: scale(1.1);
        }
        50% {
            transform: scale(1.0);
        }
        75% {
            transform: scale(1.1);
        }
        100% {
            transform: scale(1.0);
        }
    }
</style>
