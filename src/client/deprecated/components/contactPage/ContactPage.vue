<template>
    <div class="hero-body">
        <div class="container is-fluid">
            <div class="columns is-centered">
                <div class="column is-half box">
                    <div class="notification has-text-centered">
                        <span class="title">
                            CONTACT INFORMATION
                        </span>
                    </div>
                    <div class="columns is-centered">
                        <div class="column">
                            <div class="tabs is-boxed">
                                <ul>
                                    <li v-for="office in officeLocations"
                                        :key="office.id"
                                        :class="{'is-active':office.id===activeOfficeId}">
                                        <a @click="activeOfficeId=office.id">
                                            <span class="subtitle">
                                                <b>{{office.country.name}}</b>
                                            </span>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <div class="box">
                                <div class="columns">
                                    <div class="column">
                                        <span class="subtitle">
                                            {{officeLocations[activeOfficeId].title}}
                                        </span>
                                    </div>
                                </div>
                                <div class="columns">
                                    <div class="column"
                                         :class="{'is-offset-1':!isOnMobileDevice}">
                                        <span class="icon is-small">
                                            <i class="fa fa-home"></i>
                                        </span>
                                        {{officeLocations[activeOfficeId].address}}, {{officeLocations[activeOfficeId].country.name}}
                                    </div>
                                </div>
                                <div class="columns">
                                    <div class="column"
                                         :class="{'is-offset-1':!isOnMobileDevice}">
                                        <span class="icon is-small">
                                            <i class="fa fa-phone"></i>
                                        </span>
                                        {{officeLocations[activeOfficeId].telephone}}
                                    </div>
                                </div>
                                <div class="columns">
                                    <div class="column"
                                         :class="{'is-offset-1':!isOnMobileDevice}">
                                        <span class="icon is-small">
                                            <i class="fa fa-fax"></i>
                                        </span>
                                        {{officeLocations[activeOfficeId].fax}}
                                    </div>
                                </div>
                                <div class="columns">
                                    <div class="column"
                                         :class="{'is-offset-1':!isOnMobileDevice}">
                                        <span class="icon is-small">
                                            <i class="fa fa-globe"></i>
                                        </span>
                                        <a :href="officeLocations[activeOfficeId].website">http://gentry-way.com.tw</a>
                                    </div>
                                </div>
                                <div class="columns">
                                    <div class="column">
                                        <span class="subtitle">
                                            Sales Staff
                                        </span>
                                    </div>
                                </div>
                                <div v-for="staff in officeLocations[activeOfficeId].users"
                                     :key="staff.name"
                                     class="columns">
                                    <div class="column is-narrow"
                                         :class="{'is-offset-1':!isOnMobileDevice}">
                                        <span class="icon is-small">
                                            <i class="fa fa-user-circle-o"></i>
                                        </span>
                                        {{staff.name}}
                                    </div>
                                    <div class="column">
                                        <span class="icon is-small">
                                            <i class="fa fa-envelope"></i>
                                        </span>
                                        <a :href="'mailto:'+staff.email">{{staff.email}}</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapActions, mapGetters, mapMutations } from 'vuex'

    export default {
        name: 'contact-page',
        components: {},
        props: [],
        data: function () {
            return {
                activeOfficeId: 0
            }
        },
        computed: {
            ...mapGetters({
                officeLocations: 'officeLocations/data'
            })
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

<style scoped>
    div.tabs {
        margin-bottom: 0px;
    }

    span.title,
    span.subtitle {
        font-style: italic;
        font-weight: bold;
        color: darkgreen;
    }
</style>
