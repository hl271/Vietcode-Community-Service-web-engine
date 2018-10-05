import Vue from 'vue'
import VueRouter from 'vue-router'
import {store} from './store'
import fb from './firebase'

import LandingPage from '@/pages/LandingPage'
import LoginPage from '@/pages/admin/Login'
import DashboardPage from '@/pages/admin/Dashboard'

Vue.use(VueRouter)

export const router = new VueRouter({
    mode: 'history',
    routes: [
        {
            path: '/',
            component: LandingPage
        },
        {
            path: '/admin/login',
            component: LoginPage,
            meta: {
                requiresNotAdmin: true,
                checkRequestAdminPending: true
            }
        },
        {
            path: '/admin/dashboard',
            component: DashboardPage,
            meta: {
                requiresAdmin: true,
                needsAllPosts: true
            }
        }
    ]
})

router.beforeEach((to, from, next) => {
    const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin)
    const requiresNotAdmin = to.matched.some(record => record.meta.requiresNotAdmin)
    const needsAllPosts = to.matched.some(record => record.meta.needsAllPosts)
    const checkRequestAdminPending = to.matched.some(record => record.meta.checkRequestAdminPending)
    if (requiresAdmin || requiresNotAdmin) {
        if (!!fb.auth().currentUser) {
            fb.auth().currentUser.getIdTokenResult()
            .then(IdTokenResult => {
                if (!!IdTokenResult.claims.admin) {
                    store.commit('setAdmin', true)
                    if (requiresAdmin) next()
                    else if (requiresNotAdmin) next('/admin/dashboard')
                }
                else {
                    store.commit('setAdmin', false)
                    if (requiresAdmin) next('/admin/login')
                    else if (requiresNotAdmin) next()
                }
            })
            .catch(error => {
                console.log(error)
                next('/admin/login')
            });
        }
        else {
            if (requiresNotAdmin) next()
            else next('/admin/login')
        }
    }
    if (checkRequestAdminPending) {
        console.log('Reload page')
        if (!!fb.auth().currentUser) {
            fb.db().ref('admin-request/' + fb.auth().currentUser.uid).once('value', snapshot => {
                if (snapshot.exists()) {
                    console.log('Admin Request exists!')
                    store.commit('setRequestAdminPending', true)
                }
                else {
                    store.commit('setRequestAdminPending', false)
                    console.log('admin request not ẽists')
                }
            })
        }
    }
    if (needsAllPosts) {
        const postsTimestampRef = fb.db().ref('posts_timestamp/')
        postsTimestampRef.orderByValue().on('child_added', (data) => {
            console.log('child_added')
            console.log(data.val())
            if (data.val() < 0) {
                const newPost = {
                    id: data.key,
                    timestamp: data.val()
                }
                store.dispatch('addFullPost', newPost)
            }
        })
        postsTimestampRef.on('child_changed', (data) => {
            console.log('child_changed')
            if (data.val() < 0) {
                let updatedPost = {
                    timestamp: data.val(),
                    id: data.key,
                    updated: true
                }
                store.dispatch('addFullPost', updatedPost)
            }
        })
    }
    next()
})

