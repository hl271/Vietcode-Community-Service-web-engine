<template>
    <div id="blog-list">
        <h1>Tất cả bài viết</h1>
        
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
    }
}
</script>

