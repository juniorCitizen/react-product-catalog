<template>
    <div class="field">
        <div class="file has-name is-fullwidth"
             :class="dynamicClasses">
            <label class="file-label">
                <input class="file-input"
                       type="file"
                       accept="image/*"
                       multiple="true"
                       id="secondary-photos"
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
                <template v-if="secondaryPhotos===null">
                    <span class="file-name">
                        {{captions.fileName}}
                    </span>
                </template>
                <template v-else>
                    <span class="select is-multiple is-fullwidth">
                        <select multiple
                                size="(secondaryPhotos.length<=5)?secondaryPhotos.length:5">
                            <option v-for="index in captions.fileNames.length"
                                    :key="index"
                                    @click="secondaryPhotoSelection(index-1)">
                                {{captions.fileNames[index-1]}}
                            </option>
                        </select>
                    </span>
                </template>
            </label>
        </div>
    </div>
</template>

<script>
    import { mapActions, mapGetters, mapMutations } from 'vuex'

    export default {
        name: 'secondary-photos',
        components: {},
        props: [],
        data: function () {
            return {}
        },
        computed: {
            ...mapGetters({
                secondaryPhotos: 'productData/form/secondaryPhotos',
                ignoredPhotos: 'productData/form/ignoredPhotos',
                includedCount: 'productData/form/includedCount',
                newEntry: 'productData/newEntry',
                validated: 'productData/form/validation/input',
                validating: 'productData/form/validation/state'
            }),
            captions: function () {
                if (this.secondaryPhotos === null) {
                    return {
                        fileLabel: '選擇次要相片',
                        fileName: '尚未選定'
                    }
                } else {
                    let captions = {
                        fileLabel: '重新選擇次要相片',
                        fileNames: []
                    }
                    if (this.newEntry) {
                        for (let counter = 0; counter < this.secondaryPhotos.length; counter++) {
                            if (this.ignoredPhotos[counter]) {
                                captions.fileNames.push(`(${counter + 1}) ${this.secondaryPhotos[counter].name} (取消)`)
                            } else {
                                captions.fileNames.push(`(${counter + 1}) ${this.secondaryPhotos[counter].name}`)
                            }
                        }
                    } else {
                        if (this.secondaryPhotos[0].id) {
                            this.secondaryPhotos.forEach((secondaryPhoto, counter) => {
                                if (this.ignoredPhotos[counter]) {
                                    captions.fileNames.push(`(${counter + 1}) ${this.secondaryPhotos[counter].originalName} (取消)`)
                                } else {
                                    captions.fileNames.push(`(${counter + 1}) ${this.secondaryPhotos[counter].originalName}`)
                                }
                            })
                        } else {
                            for (let counter = 0; counter < this.secondaryPhotos.length; counter++) {
                                if (this.ignoredPhotos[counter]) {
                                    captions.fileNames.push(`(${counter + 1}) ${this.secondaryPhotos[counter].name} (取消)`)
                                } else {
                                    captions.fileNames.push(`(${counter + 1}) ${this.secondaryPhotos[counter].name}`)
                                }
                            }
                        }
                    }
                    return captions
                }
            },
            pass: function () {
                return this.validated('secondaryPhotos') && this.validating
            },
            warning: function () {
                return !this.validated('secondaryPhotos') && this.validating
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
                register: 'productData/form/register',
                ignorePhoto: 'productData/form/ignore',
                includePhoto: 'productData/form/include'
            }),
            ...mapActions({}),
            handleUpload: function (event) {
                if (event.target.files.length !== 0) {
                    if ((event.target.files.length < 2) || (event.target.files.length > 15)) {
                        alert('相片上傳張數必須控制在 2 ~ 15 之內')
                    } else {
                        this.register({
                            name: 'secondaryPhotos',
                            value: event.target.files
                        })
                        this.caption = '重新選擇產品次要相片'
                    }
                }
            },
            secondaryPhotoSelection: function (photoIndex) {
                if (this.ignoredPhotos[photoIndex]) {
                    if (confirm('點選確認將復原已移除項目')) {
                        this.includePhoto(photoIndex)
                    }
                } else {
                    if (this.includedCount === 2) {
                        alert('至少必須保留兩張產品次要相片')
                    } else if (confirm('點選確認將移除選取項目')) {
                        this.ignorePhoto(photoIndex)
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
