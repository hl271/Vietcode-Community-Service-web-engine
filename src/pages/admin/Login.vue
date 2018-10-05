<template>
    <div id="login">
        <div class="md-layout">
            <div class="md-layout-item">
                <h1>VCS Web Demo</h1>
                <h2>Login to access Admin Dashboard</h2>
                <p>Please login with your Google Account. After logging in, your admin request would be soon proccessed and verified by other admins.</p>
                <h3 v-if="!!this.$store.state.requestAdminPending && !!this.$store.state.currentUser">Your admin request is pending...</h3>

                <h3 v-if="!this.$store.state.requestAdminPending && !!this.$store.state.currentUser">Hmm... Seems like your admin request is broken. Resend it?</h3>
                <md-button v-if="!this.$store.state.requestAdminPending && !!this.$store.state.currentUser" @click="sendAdminRequest">Resend Admin Request</md-button>

                <md-button v-if="!this.$store.state.currentUser" @click="signIn" class="md-raised md-accent">Login with Google</md-button>
                <md-button v-if="!!this.$store.state.currentUser" @click="signOut">Sign out</md-button>
            </div>
            
        </div>
    </div>
</template>

<script>
import fb from '../../firebase'
export default {
    data() {
        return {
        }
    },
    methods: {
        signIn() {
            const provider = new fb.auth.GoogleAuthProvider();
            fb.auth().signInWithPopup(provider).then(result => {
                const isNewUser = result.additionalUserInfo.isNewUser
                const user = {
                    uid: result.user.uid,
                    email: result.user.email,
                    displayName: result.user.displayName,
                    photoURL: result.user.photoURL
                }
                if (isNewUser) {
                    this.$store.dispatch('addAdminRequestToDb', user)
                }
                else {location.reload(true)}
                
            })            
        },
        signOut() {
            fb.auth().signOut()
        },
        sendAdminRequest() {
            this.$store.dispatch('addAdminRequestToDb', user)
        }
    },
    computed: {
        
    }
}
</script>

<style scoped>

</style>


