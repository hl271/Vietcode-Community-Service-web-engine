// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import fb from './firebase'
import VueMaterial from 'vue-material'
import VueMeta from 'vue-meta'
import SocialSharing from 'vue-social-sharing'

import App from './App'

import {store} from './store'
import {router} from './router'

Vue.use(VueMaterial)
Vue.use(VueMeta)
Vue.use(SocialSharing)

import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'

Vue.config.productionTip = false

/* eslint-disable no-new */
// handle page reloads
let app
fb.auth().onAuthStateChanged(user => {
    if (!app) {
        app = new Vue({
            el: '#app',
            store,
            router,
            render: h => h(App)
        })
    }
})
