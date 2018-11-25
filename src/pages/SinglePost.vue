<template>
    <div>
        <navbar></navbar>
        <div class="post-wrapper container" v-if="singlePost !== null">            
            <h1>{{singlePost.info.title}}</h1>
            <h3>{{singlePost.info.short_description}}</h3>
            <h2>Share it!</h2>
            <social-sharing 
                      :title="singlePost.info.title"
                      :description="singlePost.info.short_description"
                      hashtags="vuejs,javascript,framework"
                      inline-template>
                <div>
                    
                    <network network="facebook">
                        <i class="fa fa-facebook"></i> Facebook
                    </network>
                    
                </div>
            </social-sharing>
            <div v-html="singlePost.content"></div>
        </div>
        <h1></h1>
    </div>
</template>

<script>
import Navbar from '@/components/Nav'
export default {
    components: {
        'navbar': Navbar
    },
    computed: {
        singlePost() {
            return this.$store.state.singlePost
        }
    },
    metaInfo() {
        return {
            title: this.singlePost !== null ? this.singlePost.info.title : 'Loading',
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
                },
                {
                    'name': 'description',
                    'content': this.singlePost !== null ? this.singlePost.info.short_description : 'Loading'
                }
            ]
        }        
    }
}
</script>

<style>
.post-wrapper p {
    font-size: 20px;
    line-height: 1.5em;
    font-family: Georgia, 'Times New Roman', Times, serif
}
.post-wrapper h1 {
    font-size: 36px;
    line-height: 1.25em;
    font-family: Verdana, Tahoma, sans-serif
}
.post-wrapper h2, .post-wrapper h3, .post-wrapper h4, .post-wrapper h5 {
    font-family: Georgia, 'Times New Roman', Times, serif
}
</style>


