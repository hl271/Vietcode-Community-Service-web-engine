<template>
    <div>
        <navbar></navbar>
        <div id="main">
            <div class="content"></div>
            <new-posts></new-posts>
        </div>
    </div>
</template>

<script>
require('../assets/js/plugins/bootstrap-switch.js')
require('../assets/js/plugins/nouislider.min.js')
require('../assets/js/now-ui-kit.min.js')
import Navbar from '@/components/Nav'
import NewPosts from '@/components/NewPosts'
export default {
    components: {
        'navbar': Navbar,
        'new-posts': NewPosts
    }
}
</script>

<style scoped>
    @import '../assets/css/bootstrap.min.css';
    @import '../assets/css/now-ui-kit.min.css';
    #main {
        margin: 1rem 5%;
        display: grid;
        grid-template-columns: 70% 30%;
        grid-template-rows: auto;
    }
</style>





