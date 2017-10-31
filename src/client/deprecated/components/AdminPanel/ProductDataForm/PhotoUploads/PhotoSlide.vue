<template>
    <div class="image-frame"
         style="position: relative;">
        <img :src="src"
             @click="emitPhotoClickEvent(photoIndex)">
        <span v-if="ignored"
              class="icon ignored-sign">
            <i class="fa fa-times-circle"></i>
        </span>
        <span class="icon numbering fa-stack">
            <i class="fa fa-circle fa-stack-2x"></i>
            <strong class="numbering fa-stack-1x">{{photoIndex+1}}</strong>
        </span>
    </div>
</template>

<script>
    import { mapActions, mapGetters, mapMutations } from 'vuex'

    export default {
        name: 'photo-slide',
        components: {},
        props: [
            'photo',
            'photoIndex',
            'ignored'
        ],
        data: function () {
            return {
                src: null
            }
        },
        computed: {
            ...mapGetters({
                flowControl: 'flowControl/activated'
            })
        },
        watch: {
            photo: function (updatedPhotoFile) {
                if (updatedPhotoFile.id !== undefined) {
                    this.src = `${this.$eVars.API_URL}/photos?photoId=${this.photo.id}`
                } else {
                    let fileReader = new FileReader()
                    fileReader.onload = (event) => {
                        this.src = event.target.result
                    }
                    fileReader.readAsDataURL(updatedPhotoFile)
                }
            }
        },
        methods: {
            ...mapMutations({}),
            ...mapActions({}),
            emitPhotoClickEvent: function (photoIndex) {
                if (!this.flowControl) {
                    this.$emit('photoClickEvent', photoIndex)
                }
            }
        },
        beforeCreate: function () { },
        created: function () { },
        beforeMount: function () { },
        mounted: function () {
            if (this.photo.id !== undefined) {
                this.src = `${this.$eVars.API_URL}/photos?photoId=${this.photo.id}`
            } else {
                let fileReader = new FileReader()
                fileReader.onload = (event) => {
                    this.src = event.target.result
                }
                fileReader.readAsDataURL(this.photo)
            }
        },
        beforeUpdate: function () { },
        updated: function () {
            if (this.photo.id !== undefined) {
                this.src = `${this.$eVars.API_URL}/photos?photoId=${this.photo.id}`
            } else {
                let fileReader = new FileReader()
                fileReader.onload = (event) => {
                    this.src = event.target.result
                }
                fileReader.readAsDataURL(this.photo)
            }
        },
        beforeDestroy: function () { },
        destroyed: function () { }
    }
</script>

<style scoped>
    img:hover {
        transform: scale(1.1);
    }

    .icon.ignored-sign {
        position: absolute;
        top: 0%;
        right: 0%;
    }

    .icon.numbering {
        position: absolute;
        top: 0%;
        left: 0%;
    }

    strong.numbering {
        color: white;
    }

    i {
        color: red;
    }
</style>
