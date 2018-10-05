<template>
    <div id="admin-blog-list">
        <h1>All Posts</h1>
        <md-button @click="reload" class="md-primary md-raised">Reload</md-button>
        <div v-if="allPosts.length > 0">
            <div v-for="post in allPostsReversed">
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
                        <md-button class="md-primary">Edit</md-button>
                        <md-button>View Full Post</md-button>
                    </md-card-actions>
                </md-card>
            </div>
        </div>
    </div>
    
</template>

<script>
export default {
    mounted() {
    },
    data: () => ({
        // posts: this.$store.state.allPosts,
        // postsNotNull: false
    }),
    methods: {
        
        reload() {
            this.$forceUpdate()
        }
    },
    computed: {
        allPosts() {
            return this.$store.state.allPosts
        },
        allPostsReversed() {
            return this.$store.state.allPosts.reverse()
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
</style>
