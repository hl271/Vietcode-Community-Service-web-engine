<template>
    <div>
        <div class="post-wrapper" v-if="singlePost !== null">
            
            <h1>{{singlePost.info.title}}</h1>
            <h3>{{singlePost.info.short_description}}</h3>
            
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
    },
    metaInfo() {
        return {
            title: 'Post',
            titleTemplate: ' %s | VCS Web Demo',
            meta: [
                {
                    'property': 'og:title',
                    'content': this.singlePost !== null ? this.singlePost.info.title : 'Loading' ,
                    'vmid': 'og:title'
                },
                {
                    'property': 'og:url',
                    'content': `${window.location.hostname}${this.$route.fullPath}` ,
                    'vmid': 'og:url'
                },
                {
                    'property': 'og:description',
                    'content':  this.singlePost !== null ? this.singlePost.info.short_description : 'Loading',
                    'vmid': 'og:description'
                },
                {
                    'property': 'og:image',
                    'content':  this.singlePost !== null ? this.singlePost.displayImageURL : 'Loading',
                    'vmid': 'og:image'
                }
            ]
        }        
    }
}
</script>

<style>

</style>


