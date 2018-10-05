<template>
  <div class="page-container">
    <md-app md-waterfall>
      <md-app-toolbar class="md-primary">
        <div class="md-toolbar-section-start">
          <md-button class="md-icon-button" @click="toggleMenu" v-if="!menuVisible">
            <md-icon>menu</md-icon>
          </md-button>
          <span class="md-title">Admin Dashboard</span>
        </div>
        <div class="md-toolbar-section-end">
          <md-button class="md-icon-button">
            <router-link to="/" exact><md-icon>home</md-icon></router-link>
          </md-button>
        </div>
        
      </md-app-toolbar>

      <md-app-drawer :md-active.sync="menuVisible" md-persistent="full">
        <md-toolbar class="md-transparent" md-elevation="0">
          <span>Navigation</span>

          <div class="md-toolbar-section-end">
            <md-button class="md-icon-button md-dense" @click="toggleMenu">
              <md-icon>keyboard_arrow_left</md-icon>
            </md-button>
          </div>
        </md-toolbar>

        <md-list>
          <md-list-item>
            <span class="md-list-item-text">{{this.$store.state.currentUser.email}}</span>
          </md-list-item>
          <md-list-item @click="showBlogPosts">
            <md-icon>move_to_inbox</md-icon>
            <span class="md-list-item-text">All Blog Posts</span>
          </md-list-item>

          <md-list-item @click="showAdminRequests">
            <md-icon>send</md-icon>
            <span class="md-list-item-text">Admin Request</span>           
          </md-list-item>

          <md-list-item @click="showCreateNewPost">
            <md-icon>create</md-icon>
            <span class="md-list-item-text">Create New Post</span>
          </md-list-item>

          <md-list-item @click="logout">
            <md-icon>logout</md-icon>
            <span class="md-list-item-text">Log out</span>
          </md-list-item>

          
        </md-list>
      </md-app-drawer>

      <md-app-content>
          <div id="app-content">
            <admin-blog-list v-if="show.allBlogPosts"></admin-blog-list>
            <div v-if="show.allAdminRequests">
                <h2>All Admin Requests</h2>
            </div>
            <create-new-post v-if="show.createNewPost"></create-new-post>
          </div>        
      </md-app-content>
    </md-app>
  </div>
</template>

<script>
import fb from '../../firebase'
import Editor from '@tinymce/tinymce-vue'
import CreateNewPost from '@/components/admin/CreateNewPost'
import AdminBlogList from '@/components/admin/AdminBlogList'
export default {
    components: {
        'editor': Editor,
        'create-new-post': CreateNewPost,
        'admin-blog-list': AdminBlogList
    },
    data: () => ({
        menuVisible: false,
        show: {
            createNewPost: false,
            allBlogPosts: true,
            allAdminRequests: false
        }
    }),
    methods: {
        toggleMenu () {
        this.menuVisible = !this.menuVisible
        },
        showAdminRequests() {
            this.show.allAdminRequests = true
            this.show.createNewPost = false
            this.show.allBlogPosts = false
        },
        showCreateNewPost() {
            this.show.allAdminRequests = false
            this.show.createNewPost = true
            this.show.allBlogPosts = false
        },
        showBlogPosts() {
            this.show.allAdminRequests = false
            this.show.createNewPost = false
            this.show.allBlogPosts = true
        },
        logout() {
          fb.auth().signOut()
          location.reload(true)
        }
    }
}
</script>

<style lang="css" scoped>
  .md-app {
    min-height: 350px;
    border: 1px solid rgba(#000, .12);
  }

   
  .md-drawer {
    width: 230px;
    max-width: calc(100vw - 125px);
  }

  #app-content {
      margin: 1rem 10% 5rem 10%;
  }

  
</style>
