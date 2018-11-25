<template>
    <div>
        <h1>Create New Post</h1>
        <image-uploader></image-uploader>                

        <md-field>
            <label>Post Title</label>
            <md-input v-model.lazy="title"></md-input>
        </md-field>

        <md-field>
            <label>Short Description</label>
            <md-textarea v-model.lazy="short_description" md-counter="80"></md-textarea>
        </md-field>

        <h3>Content</h3>
        <!-- Tiny MCE Editor -->
        <editor v-model="content" api-key="ntimow4eomwnxgr8suffbnxbgrnktocgahqje14eo1cyyd3g" :init="editorSettings"></editor>    

        <md-button v-if="!this.$store.state.uploadStatus.newPost.pending" @click="submitPost" style="float: right; margin: 1rem 0" class="md-raised md-primary">Create New Post  <md-icon>send</md-icon></md-button>
        <md-button @click="resetPost" style="float: right; margin: 1rem 0.5rem" class="md-raised md-accent">Reset</md-button>

    </div>
</template>

<script>
import Editor from '@tinymce/tinymce-vue'
import CustomEditor from '@/components/CustomEditor'
import ImageUploader from '@/components/ImageUploader'
export default {
    components: {
        'editor': Editor,
        'image-uploader': ImageUploader
    },
    data: () => ({
        editorSettings: {
            height: 500,
            menubar: false,
            plugins: [
                'advlist autolink lists link image charmap print preview anchor textcolor emoticons',
                'searchreplace visualblocks code fullscreen',
                'insertdatetime media table contextmenu paste code help wordcount'
            ],
            toolbar: "undo redo |  formatselect | bold italic underline strikethrough forecolor  | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image media | blockquote | preview",
            content_css: [
                '//fonts.googleapis.com/css?family=Lato:300,300i,400,400i',
                '/static/tinymce.css'
            ],
            theme: 'modern'
        }       
    }),
    methods: {
        handleFileUpload(files) {
            console.log('You upload an image!!!')
            console.log(files[0])
            this.$store.commit('updateNewPostDisplayImage', files[0])
        },
        submitPost() {
            this.$store.dispatch('addNewPostToDb', this.$store.state.newPost)
            this.resetPost()
        },
        resetPost() {
            this.$store.commit('resetNewPost')
        }
    },
    filters: {
        blobUrl (val) {
            if (!val || !val.constructor || val.constructor !== File) return ''
            return URL.createObjectURL(val)
        }
    },
    computed: {
        title: {
            get() {
                return this.$store.state.newPost.info.title
            },
            set(value) {
                this.$store.commit('updateNewPostTitle', value)
            }
        },
        short_description: {
            get() {
                return this.$store.state.newPost.info.short_description
            },
            set(value) {
                this.$store.commit('updateNewPostShortDescription', value)
            }
        },
        content: {
            get() {
                return this.$store.state.newPost.content
            },
            set(value) {
                this.$store.commit('updateNewPostContent', value)
            }
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


