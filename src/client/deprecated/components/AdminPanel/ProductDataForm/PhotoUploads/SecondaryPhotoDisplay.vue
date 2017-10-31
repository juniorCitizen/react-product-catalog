<template>
    <div class="notification">
        <div class="columns"
             v-for="rowIndex in rows"
             :key="rowIndex">
            <div v-for="columnIndex in columnCount(rowIndex)"
                 class="column has-text-centered"
                 :class="photoCellsPerRow.sizingClass"
                 :key="columnIndex">
                <photo-slide :photo="secondaryPhotos[imageIndex(rowIndex,columnIndex)]"
                             :photoIndex="imageIndex(rowIndex,columnIndex)"
                             :ignored="ignoredPhotos[imageIndex(rowIndex,columnIndex)]"
                             @photoClickEvent="secondaryPhotoSelection($event)">
                </photo-slide>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapActions, mapGetters, mapMutations } from 'vuex'

    import PhotoSlide from './PhotoSlide.vue'

    export default {
        name: 'secondary-photo-display',
        components: {
            PhotoSlide
        },
        props: [],
        data: function () {
            return {
                // possible settings
                // {cellCount: 12, sizingClass: 'is-1'} // smallest
                // {cellCount: 6, sizingClass: 'is-2'}
                // {cellCount: 4, sizingClass: 'is-3'}
                // {cellCount: 3, sizingGlass: 'is-4'}
                // {cellCount: 2, sizingGlass: 'is-6'}
                // {cellCount: 1, sizingGlass: ''} // largest
                photoCellsPerRow: {
                    cellCount: 6,
                    sizingClass: 'is-2'
                }
            }
        },
        computed: {
            ...mapGetters({
                secondaryPhotos: 'productData/form/secondaryPhotos',
                ignoredPhotos: 'productData/form/ignoredPhotos',
                includedCount: 'productData/form/includedCount'
            }),
            imageCount: function () {
                return this.secondaryPhotos === null ? 0 : this.secondaryPhotos.length
            },
            rows: function () {
                return Math.ceil(this.imageCount / this.photoCellsPerRow.cellCount)
            }
        },
        watch: {},
        methods: {
            ...mapMutations({
                ignorePhoto: 'productData/form/ignore',
                includePhoto: 'productData/form/include',
                register: 'productData/form/register'
            }),
            ...mapActions({}),
            columnCount: function (rowIndex) {
                let preceedingCount = (rowIndex - 1) * this.photoCellsPerRow.cellCount
                let itemCount = this.imageCount - preceedingCount
                return itemCount > this.photoCellsPerRow.cellCount ? this.photoCellsPerRow.cellCount : itemCount
            },
            imageIndex: function (rowIndex, columnIndex) {
                return ((rowIndex - 1) * this.photoCellsPerRow.cellCount) + (columnIndex - 1)
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
