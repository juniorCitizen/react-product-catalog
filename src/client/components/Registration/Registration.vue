<template>
    <div class="hero-body">
        <div class="container is-fluid">
            <div class="columns is-centered">
                <div class="column box"
                     :class="{'is-half':!isOnMobileDevice}">
                    <template v-if="registered">
                        <div class="notification has-text-centered">
                            <div class="columns is-centered">
                                <span class="title">
                                    {{user.name.toUpperCase()}},
                                </span>
                            </div>
                            <div class="columns is-centered">
                                <span class="title is-spaced">
                                    THANK YOU FOR REGISTERING WITH GENTRY WAY!
                                </span>
                            </div>
                            <div class="columns is-centered">
                                <span class="subtitle">
                                    A PDF CATALOG WILL BE FORWARDED TO "{{user.email}}" SHORTLY
                                </span>
                            </div>
                        </div>
                    </template>
                    <template v-else>
                        <div class="notification has-text-centered">
                            <div class="columns is-centered">
                                <span class="title is-spaced"
                                      :class="{'is-6':isOnMobileDevice}">
                                    REGISTER
                                </span>
                            </div>
                            <div class="columns is-centered">
                                <span class="subtitle"
                                      :class="{'is-6':isOnMobileDevice}">
                                    FOR OUR PDF CATALOG
                                </span>
                            </div>
                        </div>
                        <!-- company -->
                        <div class="field">
                            <div class="control has-icons-left has-icons-right">
                                <input class="input"
                                       :class="{'is-danger':invalidCompany,'is-success':!invalidCompany&&validationSwitch,'is-large':!isOnMobileDevice}"
                                       type="text"
                                       placeholder="Company *"
                                       :disabled="flowControl"
                                       v-model.lazy.trim="company">
                                <span class="icon is-left"
                                      :class="{'is-large':!isOnMobileDevice}">
                                    <i class="fa fa-building"></i>
                                </span>
                                <template v-if="validationSwitch">
                                    <span v-if="invalidCompany"
                                          class="icon is-right"
                                          :class="{'is-large':!isOnMobileDevice}">
                                        <i class="fa fa-warning"></i>
                                    </span>
                                    <span v-else
                                          class="icon is-right"
                                          :class="{'is-large':!isOnMobileDevice}">
                                        <i class="fa fa-check"></i>
                                    </span>
                                </template>
                            </div>
                            <p v-if="invalidCompany"
                               class="help is-danger">please provide your company title</p>
                        </div>
                        <!-- name -->
                        <div class="field">
                            <div class="control has-icons-left has-icons-right">
                                <input class="input"
                                       :class="{'is-danger':invalidName,'is-success':!invalidName&&validationSwitch,'is-large':!isOnMobileDevice}"
                                       type="text"
                                       placeholder="Name *"
                                       :disabled="flowControl"
                                       v-model.lazy.trim="name">
                                <span class="icon is-left"
                                      :class="{'is-large':!isOnMobileDevice}">
                                    <i class="fa fa-user"></i>
                                </span>
                                <template v-if="validationSwitch">
                                    <span v-if="invalidName"
                                          class="icon is-right"
                                          :class="{'is-large':!isOnMobileDevice}">
                                        <i class="fa fa-warning"></i>
                                    </span>
                                    <span v-else
                                          class="icon is-right"
                                          :class="{'is-large':!isOnMobileDevice}">
                                        <i class="fa fa-check"></i>
                                    </span>
                                </template>
                            </div>
                            <p v-if="invalidName"
                               class="help is-danger">tell us your name</p>
                        </div>
                        <!-- email -->
                        <div class="field">
                            <div class="control has-icons-left has-icons-right">
                                <input class="input"
                                       :class="{'is-danger':invalidEmail,'is-success':!invalidEmail&&validationSwitch,'is-large':!isOnMobileDevice}"
                                       type="email"
                                       placeholder="Email *"
                                       :disabled="flowControl"
                                       v-model.lazy.trim="email">
                                <span class="icon is-left"
                                      :class="{'is-large':!isOnMobileDevice}">
                                    <i class="fa fa-envelope"></i>
                                </span>
                                <template v-if="validationSwitch">
                                    <span v-if="invalidEmail"
                                          class="icon is-right"
                                          :class="{'is-large':!isOnMobileDevice}">
                                        <i class="fa fa-warning"></i>
                                    </span>
                                    <span v-else
                                          class="icon is-right"
                                          :class="{'is-large':!isOnMobileDevice}">
                                        <i class="fa fa-check"></i>
                                    </span>
                                </template>
                            </div>
                            <p v-if="invalidEmail"
                               class="help is-danger">valid email is required in order to receive our catalog</p>
                        </div>
                        <!-- regions and countries selector -->
                        <template v-if="!isOnMobileDevice">
                            <div class="field is-grouped">
                                <!-- regions -->
                                <div class="control has-icons-left">
                                    <div class="select"
                                         :class="{'is-large':!isOnMobileDevice}">
                                        <select v-model="region"
                                                :disabled="flowControl"
                                                @change="countryId=''">
                                            <option value=""
                                                    disabled>
                                                Region
                                            </option>
                                            <option v-for="(region,regionIndex) in regions"
                                                    :value="region.region"
                                                    :key="regionIndex">
                                                {{region.region}}
                                            </option>
                                        </select>
                                    </div>
                                    <div class="icon is-left"
                                         :class="{'is-large':!isOnMobileDevice}">
                                        <i class="fa fa-globe"></i>
                                    </div>
                                </div>
                                <!-- countries -->
                                <div class="control is-expanded has-icons-left">
                                    <div class="select is-fullwidth"
                                         :class="{'is-danger':invalidCountry,'is-success':!invalidCountry&&validationSwitch,'is-large':!isOnMobileDevice}">
                                        <select v-model="countryId"
                                                :disabled="flowControl"
                                                @change="changeRegion(countryId)">
                                            <option value=""
                                                    disabled>
                                                Country *
                                            </option>
                                            <option v-for="(country,countryIndex) in filteredCountryList"
                                                    :value="country.id"
                                                    :key="countryIndex">
                                                {{country.name}}
                                            </option>
                                        </select>
                                    </div>
                                    <div class="icon is-left"
                                         :class="{'is-large':!isOnMobileDevice}">
                                        <i v-if="flagUrl===''"
                                           class="fa fa-globe"></i>
                                        <img v-else
                                             :src="flagUrl"
                                             width="40px">
                                    </div>
                                    <p v-if="invalidCountry"
                                       class="help is-danger">please tell us where you are from</p>
                                </div>
                            </div>
                        </template>
                        <template v-else>
                            <!-- regions -->
                            <div class="field">
                                <div class="control is-expanded has-icons-left">
                                    <div class="select is-fullwidth"
                                         :class="{'is-large':!isOnMobileDevice}">
                                        <select v-model="region"
                                                :disabled="flowControl"
                                                @change="countryId=''">
                                            <option value=""
                                                    disabled>
                                                Region
                                            </option>
                                            <option v-for="(region,regionIndex) in regions"
                                                    :value="region.region"
                                                    :key="regionIndex">
                                                {{region.region}}
                                            </option>
                                        </select>
                                    </div>
                                    <div class="icon is-left"
                                         :class="{'is-large':!isOnMobileDevice}">
                                        <i class="fa fa-globe"></i>
                                    </div>
                                </div>
                            </div>
                            <!-- countries -->
                            <div class="field">
                                <div class="control is-expanded has-icons-left">
                                    <div class="select is-fullwidth"
                                         :class="{'is-danger':invalidCountry,'is-success':!invalidCountry&&validationSwitch,'is-large':!isOnMobileDevice}">
                                        <select v-model="countryId"
                                                :disabled="flowControl"
                                                @change="changeRegion(countryId)">
                                            <option value=""
                                                    disabled>
                                                Country *
                                            </option>
                                            <option v-for="(country,countryIndex) in filteredCountryList"
                                                    :value="country.id"
                                                    :key="countryIndex">
                                                {{country.name}}
                                            </option>
                                        </select>
                                    </div>
                                    <div class="icon is-left"
                                         :class="{'is-large':!isOnMobileDevice}">
                                        <i v-if="flagUrl===''"
                                           class="fa fa-globe">
                                        </i>
                                        <img v-else
                                             :src="flagUrl"
                                             width="20">
                                    </div>
                                    <p v-if="invalidCountry"
                                       class="help is-danger">please tell us where you are from</p>
                                </div>
                            </div>
                        </template>
                        <!-- comments -->
                        <div class="field">
                            <div class="control">
                                <textarea class="textarea"
                                          :class="{'is-large':!isOnMobileDevice}"
                                          placeholder="Questions or comments"
                                          rows="3"
                                          :disabled="flowControl"
                                          v-model.trim="comments">
                                </textarea>
                            </div>
                        </div>
                        <!-- checkbox -->
                        <div class="field"
                             v-if="itemCount>0">
                            <label class="checkbox">
                                <input type="checkbox"
                                       v-model="authorized">
                                <span :style="noticeTextSize">
                                    I WISH TO BE CONTACTED ABOUT THE {{itemCount}} PRODUCT(S) THAT I'VE SELECTED
                                </span>
                            </label>
                        </div>
                        <!-- botPrevention -->
                        <div class="field"
                             style="display:none;">
                            <input class="input"
                                   type="text"
                                   required
                                   v-model="botPrevention">
                        </div>
                        <!-- submission buttons -->
                        <div class="field is-grouped">
                            <div class="control">
                                <button class="button is-primary"
                                        :class="{'is-large':!isOnMobileDevice,'is-small':isOnMobileDevice,'is-loading':flowControl}"
                                        :disabled="flowControl"
                                        @click="userRegistration">
                                    REGISTER
                                </button>
                            </div>
                            <div class="control">
                                <button class="button is-danger"
                                        :class="{'is-large':!isOnMobileDevice,'is-small':isOnMobileDevice}"
                                        :disabled="flowControl"
                                        @click="clearForm">
                                    CLEAR FORM
                                </button>
                            </div>
                        </div>
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapActions, mapGetters, mapMutations } from 'vuex'

    export default {
        name: 'registration',
        components: {},
        props: [],
        data: function () {
            return {
                company: '',
                name: '',
                email: '',
                region: '',
                countryId: '',
                comments: '',
                authorized: true,
                botPrevention: '',
                validationSwitch: false
            }
        },
        computed: {
            ...mapGetters({
                regions: 'regions/data',
                countries: 'countries/data',
                flowControl: 'flowControl/activated',
                registered: 'credentials/registered',
                user: 'credentials/user',
                itemCount: 'interestedProducts/itemCount'
            }),
            filteredCountryList: function () {
                if (this.region === '') {
                    return this.countries
                } else {
                    return this.countries.filter((country) => {
                        return country.region === this.region
                    })
                }
            },
            invalidCompany: function () {
                return (this.company === '') && this.validationSwitch
            },
            invalidName: function () {
                return (this.name === '') && this.validationSwitch
            },
            invalidEmail: function () {
                return !(/^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/.test(this.email)) && this.validationSwitch
            },
            invalidCountry: function () {
                return (this.countryId === '') && this.validationSwitch
            },
            readyToSubmit: function () {
                return !(this.invalidCompany || this.invalidCountry || this.invalidEmail || this.invalidName)
            },
            flagUrl: function () {
                return this.countryId === '' ? '' : `${this.$eVars.API_URL}/countries/flags?countryId=${this.countryId.toLowerCase()}`
            },
            flagSize: function () {
                return this.isOnMobileDevice ? '20px' : '30px'
            },
            noticeTextSize: function () {
                if (this.isMobile) {
                    return {
                        'font-weight': 'bold',
                        'font-size': '75%'
                    }
                } else {
                    return {
                        'font-weight': 'bolder'
                    }
                }
            }
        },
        watch: {},
        methods: {
            ...mapMutations({}),
            ...mapActions({}),
            clearForm: function () {
                this.company = ''
                this.name = ''
                this.email = ''
                this.region = ''
                this.countryId = ''
                this.comments = ''
                this.authorized = false
                this.botPrevention = ''
                this.validationSwitch = false
            },
            changeRegion: function (countryId) {
                if ((this.countryId !== '') && (this.region === '')) {
                    this.region = this.countries.filter((country) => {
                        return country.id === countryId
                    })[0].region
                }
            },
            userRegistration: function () {
                this.validationSwitch = true
                if (this.readyToSubmit) {
                    this.$store
                        .dispatch('userRegistration', {
                            company: this.company,
                            name: this.name,
                            email: this.email,
                            region: this.region,
                            countryId: this.countryId,
                            comments: this.comments,
                            authorized: this.authorized,
                            botPrevention: this.botPrevention
                        })
                        .then((userData) => {
                            this.clearForm()
                            return alert(`registered successfully, thank you, ${userData.name}!`)
                        })
                        .catch((error) => {
                            this.clearForm()
                            alert('registration failure')
                            console.log(error.name)
                            console.log(error.message)
                            console.log(error.stack)
                        })
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
    span.title,
    span.subtitle {
        font-style: italic;
        font-weight: bold;
        color: darkgreen;
    }
</style>
