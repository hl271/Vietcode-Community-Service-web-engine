<template>
    <div class="newposts">
        <h2>Bài viết mới nhất</h2>
        <hr>
        <div class="posts-list">
            <div class="post-wrapper-info" v-if="allPosts.length > 0" v-for="post in allPosts" :key="post.id">
                <div class="post-image">
                    <img class="display-photo" :src="post.displayImageURL">
                </div>
                <div class="post-content">
                    <router-link :to="'/posts/'+post.id" exact><h3 class="post-title">{{post.info.title | trimmedTitle}}</h3></router-link>
                    <h5>{{post.timestamp | formatDate}}</h5>
                    <p>{{post.info.short_description | trimmedText}}</p>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import fb from '../firebase'
export default {
    created() {
        const postsTimestampRef = fb.db().ref('posts_timestamp/')
        postsTimestampRef.orderByValue().limitToFirst(3).on('child_added', (data) => {
            console.log('child_added')
            console.log(data.val())
            if (data.val() < 0) {
                const newPost = {
                    id: data.key,
                    timestamp: data.val(),
                    newestPost: true
                }
                this.$store.dispatch('addFullPost', newPost)
            }
        })
        postsTimestampRef.on('child_changed', (data) => {
            console.log('child_changed')
            if (data.val() < 0) {
                let updatedPost = {
                    timestamp: data.val(),
                    id: data.key,
                    updated: true,
                    newestPost: true
                }
                this.$store.dispatch('addFullPost', updatedPost)
            }
        })
    },
    computed: {
        allPosts() {
            return this.$store.getters.newestPosts
        }
    },
    filters: {
        formatDate(val) {
            if (!val) { return '-' }
            let date = new Date(val*-1)
            let dateString = date.toDateString()
            let timeString = date.toLocaleString()
            return timeString
        },
        trimmedText(val) {
            return !!val ? val.substr(0, 80) + '...' : ""
        },
        trimmedTitle(val) {
            return !!val ? val.substr(0, 50) + '...' : ""
        }
    }
}
</script>

<style scoped>
    .newposts {
        padding: 1.5rem 1.25rem;
        border: 1px solid black;
        border-radius: 5px;
    }
    .post-wrapper-info {
        display: grid;
        grid-template-columns: 30% 70%;
        grid-template-rows: auto;
        margin-bottom: 0.5rem;
        margin-top: 0.5rem;
    }
    .display-photo {
        width: 65px;
        height: 65px;
        border: 1px solid white;
        border-radius: 5px;
        object-fit: cover;
    }
    .post-content {
        padding-left: 0.6rem;
    }
    h1, h2, h3, h4, h5, h6, p {
        margin-bottom: 0.25rem;
        margin-top: 0;
    }
    h3 {
        font-size: 0.75rem;
    }
    p {
        font-size: 0.6rem;
    }
    h5 {font-size: 0.6rem;}
    h2 {font-size: 1.25rem}

</style>


