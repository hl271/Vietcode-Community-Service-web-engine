<template>
    <div id="admin-blog-list">
        <h1>All Posts</h1>
        <div v-if="allPosts.length > 0">
            <div v-for="post in allPosts" :key="post.id">
                <md-card class="post md-elevation-3">
                    <md-card-header>
                        <md-card-header-text>
                        <div class="md-title">{{post.info.title}}</div>
                        <div class="md-subhead">Modified: {{post.timestamp | formatDate}}</div>
                        <p>{{post.info.short_description}}</p>
                        </md-card-header-text>

                        <md-card-media md-big>
                            <img class="display-photo" :src="post.displayImageURL" alt="Display Photo">
                        </md-card-media>
                    </md-card-header>

                    <md-card-actions>
                        <!-- <md-progress-spinner class="md-accent"  md-mode="indeterminate" :md-diameter="30" :md-stroke="3"></md-progress-spinner> -->
                        <md-button class="md-accent" @click="deletePost(post.id)">Delete</md-button>
                        <md-button class="md-primary" @click="editPost(post)">Edit</md-button>
                        <md-button>View Full Post</md-button>
                    </md-card-actions>
                </md-card>
            </div>
        </div>
        <md-dialog class="editing-post" :md-active.sync="showPostDialog">
            <md-dialog-title>Edit Post</md-dialog-title>
            <md-dialog-content v-if="editingPost !== null">
                <md-field>
                    <label>Post Title</label>
                    <md-input v-model.lazy="title"></md-input>
                </md-field>

                <md-field>
                    <label>Short Description</label>
                    <md-textarea v-model.lazy="short_description" md-counter="80"></md-textarea>
                </md-field>
                <h2>Content</h2>
                <!-- Tiny MCE Editor -->
                <editor v-model="content" api-key="ntimow4eomwnxgr8suffbnxbgrnktocgahqje14eo1cyyd3g" :init="editorSettings"></editor> 
            </md-dialog-content>
            <md-dialog-actions>
                <md-button class="md-primary" @click="closeEditingPost">Close</md-button>
                <md-progress-spinner v-if="this.$store.state.uploadStatus.editingPost.pending" md-mode="indeterminate" :md-diameter="30" :md-stroke="3"></md-progress-spinner>
                <md-button class="md-primary" v-if="!this.$store.state.uploadStatus.editingPost.pending" @click="saveEditingPost">Save</md-button>
            </md-dialog-actions>
        </md-dialog>
    </div>
    
</template>

<script>
import Editor from '@tinymce/tinymce-vue'
import CustomEditor from '@/components/CustomEditor'
export default {
    components: {
        'editor': Editor
    },
    data: () => ({
        // posts: this.$store.state.allPosts,
        // postsNotNull: false
        showPostDialog: false,
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
        saveEditingPost () {
            this.$store.dispatch('saveEditingPostToServer')
        },
        reload() {
            this.$forceUpdate()
        },
        editPost(post) {
            this.$store.commit('addEditingPostToState', post)
            this.showPostDialog = true
        },
        deletePost(postId) {
            this.$store.dispatch('deletePostFromServer', postId)
        },
        closeEditingPost() {
            this.$store.commit('deleteEditingPostFromState')
            this.showPostDialog = false
        }
    },
    computed: {
        allPosts() {
            return this.$store.getters.allPosts
        },
        
        editingPost() {
            return this.$store.state.editingPost
        },
        storeExist() {
            return !!this.$store
        },
        content: {
            get() {
                return this.$store.state.editingPost.content
            },
            set(value) {
                this.$store.commit('updateEditingPostContent', value)
            }
        },
        title: {
            get() {
                return this.$store.state.editingPost.info.title
            },
            set(value) {
                this.$store.commit('updateEditingPostTitle', value)
            }
        },
        short_description: {
            get() {
                return this.$store.state.editingPost.info.short_description
            },
            set(value) {
                this.$store.commit('updateEditingPostShortDescription', value)
            }
        }
    },
    filters: {
        formatDate(val) {
            if (!val) { return '-' }
            let date = new Date(val*-1)
            let dateString = date.toDateString()
            let timeString = date.toLocaleString()
            return timeString
        }
    }
}
</script>

<style scoped>
    .display-photo {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    .post {
        margin: 1rem 0
    }
    .editing-post--content {
        margin: 1rem;
    }
    .editing-post {
        width: 80%;
    }
</style>
