<template>
    <div>
        <navbar></navbar>
        <div class="container" id="posts-section">
            <h1>Tất cả bài viết</h1>
            <div class="posts-list">
                <div class="post-wrapper-info" v-if="allPosts.length > 0" v-for="post in allPosts" :key="post.id">
                    <div class="post-image">
                        <img class="display-photo" :src="post.displayImageURL">
                    </div>
                    <div class="post-content">
                        <router-link :to="'/posts/'+post.id" exact><h2 class="post-title">{{post.info.title}}</h2></router-link>
                        <h4>{{post.timestamp | formatDate}}</h4>
                        <p>{{post.info.short_description}}</p>
                    </div>
                </div>
            </div>
            
        </div>
    </div>
    
</template>

<script>
import fb from '../firebase'
import Navbar from '@/components/Nav'
export default {
    components: {
        'navbar': Navbar
    },
    created() {
        const postsTimestampRef = fb.db().ref('posts_timestamp/')
        postsTimestampRef.orderByValue().on('child_added', (data) => {
            console.log('child_added')
            console.log(data.val())
            if (data.val() < 0) {
                const newPost = {
                    id: data.key,
                    timestamp: data.val()
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
                    updated: true
                }
                this.$store.dispatch('addFullPost', updatedPost)
            }
        })
    },
    data() {
        return {

        }
    },
    computed: {
        allPosts() {
            return this.$store.getters.allPosts
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

.post-wrapper-info {
    display: grid;
    grid-template-columns: 35% 65%;
    grid-template-rows: 275px;
    margin-bottom: 3rem;
    margin-top: 1rem;
}
.display-photo {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
.post-content {
    padding-left: 1.5rem;
}
</style>
