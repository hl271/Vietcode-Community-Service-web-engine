<template>
    <div class="container" id="posts-section">
        <h1>Tất cả bài viết</h1>
        <div class="posts-list">
            <div class="post-wrapper" v-if="allPosts.length > 0" v-for="post in allPosts">
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
</template>

<script>
export default {
    data() {
        return {

        }
    },
    computed: {
        allPosts() {
            return this.$store.state.allPosts
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
.posts-list {
    margin: 1rem 10%;
}
.post-wrapper {
    display: grid;
    grid-template-columns: 35% 65%;
    grid-template-rows: 275px;
    grid-gap: 2rem;
    margin-bottom: 3rem;
    margin-top: 1rem;
}
.display-photo {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
</style>
