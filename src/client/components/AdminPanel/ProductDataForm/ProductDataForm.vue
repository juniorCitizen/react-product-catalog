<template>
    <div class="box">
        <div class="title notification box is-4">
            <span>新建產品資料</span>
        </div>
        <submission></submission>
        <div class="field is-grouped">
            <product-series></product-series>
            <product-type></product-type>
        </div>
        <text-input :inputReference="'code'">
            <input class="input"
                   :class="dynamicClasses('code')"
                   type="text"
                   placeholder="輸入產品編號 (必填)"
                   :disabled="flowControl"
                   :value="code"
                   @change="updateValue('code',$event)">
        </text-input>
        <text-input :inputReference="'name'">
            <input class="input"
                   :class="dynamicClasses('name')"
                   type="text"
                   placeholder="輸入產品名稱 (必填)"
                   :disabled="flowControl"
                   :value="name"
                   @change="updateValue('name',$event)">
        </text-input>
        <text-input :inputReference="'description'">
            <textarea class="textarea"
                      :class="dynamicClasses('description')"
                      placeholder="輸入產品敘述 (必填)"
                      :disabled="flowControl"
                      :value="description"
                      @change="updateValue('description',$event)">
            </textarea>
        </text-input>
        <primary-photo></primary-photo>
        <primary-photo-display v-if="primaryPhoto!==null">
        </primary-photo-display>
        <secondary-photos></secondary-photos>
        <secondary-photo-display v-if="secondaryPhotos!==null">
        </secondary-photo-display>
    </div>
</template>

<script>
    import { mapActions, mapGetters, mapMutations } from 'vuex'

    import Submission from './Submission/Submission.vue'
    import ProductSeries from './ProductSeries.vue'
    import ProductType from './ProductType.vue'
    import TextInput from './TextInput.vue'
    import PrimaryPhoto from './PhotoUploads/PrimaryPhoto.vue'
    import PrimaryPhotoDisplay from './PhotoUploads/PrimaryPhotoDisplay.vue'
    import SecondaryPhotos from './PhotoUploads/SecondaryPhotos.vue'
    import SecondaryPhotoDisplay from './PhotoUploads/SecondaryPhotoDisplay.vue'

    export default {
        name: 'product-data-form',
        components: {
            Submission,
            ProductSeries,
            ProductType,
            TextInput,
            PrimaryPhoto,
            PrimaryPhotoDisplay,
            SecondaryPhotos,
            SecondaryPhotoDisplay
        },
        props: [],
        data: function () {
            return {}
        },
        computed: {
            ...mapGetters({
                code: 'productData/form/code',
                name: 'productData/form/name',
                description: 'productData/form/description',
                primaryPhoto: 'productData/form/primaryPhoto',
                secondaryPhotos: 'productData/form/secondaryPhotos',
                flowControl: 'flowControl/activated',
                validated: 'productData/form/validation/input',
                validating: 'productData/form/validation/state'
            })
        },
        watch: {},
        methods: {
            ...mapMutations({
                register: 'productData/form/register'
            }),
            ...mapActions({}),
            updateValue: function (inputReference, event) {
                this.register({
                    name: inputReference,
                    value: event.target.value.trim()
                })
            },
            dynamicClasses: function (inputReference) {
                return {
                    'is-danger': !this.validated(inputReference) && this.validating,
                    'is-success': this.validated(inputReference) && this.validating
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
