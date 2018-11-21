<template>
    <div id="admin-blog-list">
        <h1>All Posts</h1>
        <md-button @click="reload" class="md-primary md-raised">Reload</md-button>
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
                        <md-button class="md-accent">Delete</md-button>
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
                <editor v-model.lazy="content" api-key="ntimow4eomwnxgr8suffbnxbgrnktocgahqje14eo1cyyd3g" :init="editorSettings"></editor>
            </md-dialog-content>
            <md-dialog-actions>
                <md-button class="md-primary" @click="closeEditingPost">Close</md-button>
                <md-button class="md-primary">Save</md-button>
            </md-dialog-actions>
        </md-dialog>
    </div>
    
</template>

<script>
import Editor from '@tinymce/tinymce-vue'
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
                'advlist autolink lists link image charmap print preview anchor textcolor',
                'searchreplace visualblocks code fullscreen',
                'insertdatetime media table contextmenu paste code help wordcount'
            ],
            toolbar: "insert | undo redo |  formatselect | bold italic backcolor  | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat",
            content_css: [
                '//fonts.googleapis.com/css?family=Lato:300,300i,400,400i'
            ]
        }     
    }),
    methods: {
        
        reload() {
            this.$forceUpdate()
        },
        editPost(post) {
            this.$store.commit('addEditingPostToState', post)
            this.showPostDialog = true
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
