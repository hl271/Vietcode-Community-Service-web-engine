<template>
    <div>
        <md-card id="display-image-holder">
            <md-card-media-cover md-solid>
                <md-card-media md-ratio="1:1">
                <img :src="this.$store.state.newPost.displayImageFile | blobURL" :alt="this.$store.state.newPost.displayImageFile.name">
                </md-card-media>
                <md-card-area>
                <md-card-header>
                    <span class="md-title">Post Image</span>
                    <span class="md-subhead">{{this.$store.state.newPost.displayImageFile.name}}</span>
                </md-card-header>
                </md-card-area>
            </md-card-media-cover>
        </md-card> 
        <md-field >
            <label>Post Image</label>
            <md-file name="postImage" @change="handleFileUpload($event.target.files)" accept="image/*" />
        </md-field>      
    </div>
    
</template>

<script>
export default {
    methods: {
        handleFileUpload(files) {
            let imageFile = files[0]
            // // TODO: Constructing successfully the '/processImage' API to resize the uploaded Image 
            // this.$store.dispatch('processImageOnServer', imageFile)
            this.$store.commit('updateNewPostDisplayImage', imageFile)
        }
    },
    computed: {
        base64ImageFile() {
            let imageFile = this.$store.state.newPost.displayImageFile
            if (!!imageFile) {
                let base64ImageFile = imageFile.toString('base64')
                console.log(base64ImageFile)
                return 'data:image/jpeg;base64,'+imageFile.toString('base64')
            }
            else return ''            
        }
    },
    filters: { 
        blobURL(val) {
            console.log(!val || !val.constructor || val.constructor !== File)
            if (!val || !val.constructor || val.constructor !== File) return ''
            console.log(val)
            return URL.createObjectURL(val)
        }      
    }
}
</script>

<style scoped>
#display-image-holder {
      max-width: 200px;
      margin: 10px auto;
  }
</style>
