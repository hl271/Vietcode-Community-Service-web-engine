<template>
    <div>
        <div class="post-wrapper" v-if="singlePost !== null">
            <h1>{{singlePost.info.title}}</h1>
            <div v-html="singlePost.content"></div>
        </div>
        <h1></h1>
    </div>
</template>

<script>
export default {
    computed: {
        singlePost() {
            return this.$store.state.singlePost
        }
    }
}
</script>

<style>

</style>


