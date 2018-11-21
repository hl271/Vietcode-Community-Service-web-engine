<template>
    <div id="admin-requests">
        <h1>Admin requests</h1>
        <transition-group name="list">
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
                        <md-button @click="handleAccept(request.id)" class="md-primary">Accept</md-button>
                        <md-button @click="handleDeny(request.id)" class="md-accent">Deny</md-button>
                    </md-card-actions>
                </md-card>
            </div>
        </transition-group>
        
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
    },
    methods: {
        handleAccept(id) {
            this.$store.dispatch('sendAcceptAdminRequest', id)
        },
        handleDeny(id) {
            this.$store.dispatch('sendDenyAdminRequest', id)
        }
    }
}
</script>

<style scoped>
.list-enter, .list-leave-to {
    opacity: 0;
    transform: translateY(30px);
}
.list-leave-active {
    position: absolute;
}
</style>
