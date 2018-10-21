<template>
    <div id="admin-requests">
        <h1>Admin requests</h1>
        <div v-for="request in adminRequests" :key="request.id">
            <md-card class="">
                <md-card-header>
                    <md-card-header-text>
                    <div class="md-title">{{request.displayName}}</div>
                    <div class="md-subhead">{{request.email}}</div>
                    </md-card-header-text>

                    <md-card-media>
                    <img :src="request.photoURL" alt="Avatar">
                    </md-card-media>
                </md-card-header>

                <md-card-actions>
                    <md-button class="md-primary">Accept</md-button>
                    <md-button class="md-accent">Deny</md-button>
                </md-card-actions>
            </md-card>
        </div>
    </div>
</template>

<script>
import fb from '../../firebase'
export default {
    created() {
        const adminRequestsRef = fb.db().ref('admin-request/')
        adminRequestsRef.on('child_added', data => {
            const request = {
                id: data.key,
                displayName: data.val().displayName,
                email: data.val().email,
                photoURL: data.val().photoURL
            }
            this.$store.commit('addAdminRequestToState', request)
        })
    },
    data: () => ({
    }),
    computed: {
        adminRequests() {
            return this.$store.state.allAdminRequests
        }
    }
}
</script>

