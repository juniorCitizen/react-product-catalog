<template>
    <div class="field">
        <div class="file has-name is-fullwidth"
             :class="dynamicClasses">
            <label class="file-label">
                <input id="primary-photo"
                       class="file-input"
                       type="file"
                       accept="image/*"
                       @change="handleUpload($event)">
                <span class="file-cta">
                    <span class="file-icon">
                        <i v-if="pass"
                           class="fa fa-check"></i>
                        <i v-else-if="warning"
                           class="fa fa-times"></i>
                        <i v-else
                           class="fa fa-upload"></i>
                    </span>
                    <span class="file-label">
                        {{captions.fileLabel}}
                    </span>
                </span>
                <span class="file-name">
                    {{captions.fileName}}
                </span>
            </label>
        </div>
    </div>
</template>

<script>
    import { mapActions, mapGetters, mapMutations } from 'vuex'

    export default {
        name: 'primary-photo',
        components: {},
        props: [],
        data: function () {
            return {}
        },
        computed: {
            ...mapGetters({
                primaryPhoto: 'productData/form/primaryPhoto',
                validated: 'productData/form/validation/input',
                validating: 'productData/form/validation/state'
            }),
            captions: function () {
                if (this.primaryPhoto === null) {
                    return {
                        fileLabel: '選擇主要相片',
                        fileName: '尚未選定'
                    }
                } else {
                    return {
                        fileLabel: '重新選擇主要相片',
                        fileName: this.primaryPhoto[0].name ? this.primaryPhoto[0].name : this.primaryPhoto[0].originalName
                    }
                }
            },
            pass: function () {
                return this.validated('primaryPhoto') && this.validating
            },
            warning: function () {
                return !this.validated('primaryPhoto') && this.validating
            },
            dynamicClasses: function () {
                return {
                    'is-danger': this.warning,
                    'is-success': this.pass
                }
            }
        },
        watch: {},
        methods: {
            ...mapMutations({
                register: 'productData/form/register'
            }),
            ...mapActions({}),
            handleUpload: function (event) {
                if (event.target.files.length === 1) {
                    this.register({
                        name: 'primaryPhoto',
                        value: event.target.files
                    })
                } else {
                    if (confirm('確認移除產品主要相片')) {
                        this.register({
                            name: 'primaryPhoto',
                            value: null
                        })
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

<style scoped></style>
