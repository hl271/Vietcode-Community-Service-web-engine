import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import fb from './firebase'

// const API_URL = 'http://localhost:5000/vcswebdemo/us-central1/app'
const API_URL = 'https://us-central1-vcswebdemo.cloudfunctions.net/app'
Vue.use(Vuex)

fb.auth().onAuthStateChanged(user => {
    console.log('auth state changed!!!')
    if (user) {
        store.commit('setCurrentUser', user)
        fb.auth().currentUser.getIdTokenResult()
            .then(IdTokenResult => {
                if (!!IdTokenResult.claims.admin) {
                    store.commit('setAdmin', true)
                }
                else {
                    store.commit('setAdmin', false)
                }
            })
            .catch(error => {console.log(error)});
            
    }
    else {
        store.commit('setCurrentUser', null)
        store.commit('setAdmin', false)
    }
})

const initialState = () => ({
    currentUser: null,
    isAdmin: false,
    requestAdminPending: false,
    uploadPostStatus: {
        toFirebaseDb: {
            success: false,
            error: null
        },
        toFirebaseStorage: {
            success: false,
            error: null
        }
    },
    lists: {
        posts: [],
        adminReqs: []
    },
    allPosts: {},
    newPost: {
        info: {
            title: "",
            short_description: ""
        },
        displayImageFile: "",
        content: "",
        timestamp: "",
        id: ""
    },
    editingPost: null,
    singlePost: null,
    allAdminRequests: []
})
const getters = {
    allPosts: state => {
        let posts = []
        state.lists.posts.forEach((postId, i) => {
            if (postId in state.allPosts) {
                let post = state.allPosts[postId]
                posts.push(post)
            }
        })
        return posts
    }
    
}
const actions = {
    addAdminRequestToDb ({commit, state}, user) {
        const newAdminRequestRef = fb.db().ref('admin-request/'+ user.uid)
        newAdminRequestRef.set({
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL
        }, (error) => {
            if (error) {console.log(error)}
            else {
                commit('setRequestAdminPending', true)
            }
        })
    },

    addNewPostToDb ({commit, state, dispatch}, newPost) {
        const displayImageRef = fb.storage().ref('display_images/')
        const postsInfoRef = fb.db().ref('posts_info/')
        const postsTimeStampRef = fb.db().ref('posts_timestamp/')
        const newPostKey = postsInfoRef.push().key

        // Change timestamp of post 
        newPost.timestamp = fb.db.ServerValue.TIMESTAMP
        // Update post data at the same time in postsContentRef and postsInfoRef
        const updates = {}
        updates['posts_info/' + newPostKey] = newPost.info
        updates['posts_content/' + newPostKey] = newPost.content
        fb.db().ref().update(updates, (error) => {
            if (error) {
                commit('setPostUploadError', error)
                commit('setPostUploadStatus', false)
            }
            else {
                //Upload Display Image File To Firebase Storage
                let uploadTask = displayImageRef.child(newPostKey).put(newPost.displayImageFile)

                uploadTask.on('state_changed', function(snapshot){
                    // Observe state change events such as progress, pause, and resume
                    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                    switch (snapshot.state) {
                    case fb.storage.TaskState.PAUSED: // or 'paused'
                        console.log('Upload is paused');
                        break;
                    case fb.storage.TaskState.RUNNING: // or 'running'
                        console.log('Upload is running');
                        break;
                    }
                }, function(error) {
                    // Handle unsuccessful uploads
                    commit('setPostImageUploadError', error)
                    commit('setPostImageUploadStatus', false)
                }, function() {                    
                    // Handle successful uploads on complete
                    commit('setPostImageUploadStatus', true)
                    //After all other parts of post is successfully added to firebase...
                    //Add timestamp of post 
                    postsTimeStampRef.child(newPostKey).set(newPost.timestamp, error => {
                        if (error) commit('setPostUploadError', error)
                        else {
                            postsTimeStampRef.child(newPostKey).once('value', data => {
                                const negativeTimestamp = data.val() * -1
                                postsTimeStampRef.child(newPostKey).set(negativeTimestamp, error => {
                                    if (error) {
                                        commit('setPostUploadStatus', false)
                                        commit('setPostUploadError', error)
                                    }
                                    else commit('setPostUploadStatus', true)
                                })
                            })
                        }                        
                    })
                    // Get the download URL: https://firebasestorage.googleapis.com/...
                    uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                        console.log('File available at', downloadURL);
                    });
                });               
            }
        })
    },
    addFileToStorage({commit, state}, file) {
        const fileRef = fb.storage().ref(file.fileRef)
        const fileData = file.fileData
        let uploadTask = fileRef.put(fileData)

        uploadTask.on('state_changed', function(snapshot){
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
                case fb.storage.TaskState.PAUSED: // or 'paused'
                console.log('Upload is paused');
                break;
                case fb.storage.TaskState.RUNNING: // or 'running'
                console.log('Upload is running');
                break;
            }
        }, function(error) {
            // Handle unsuccessful uploads
            commit('setPostImageUploadError', error)
            commit('setPostImageUploadStatus', false)
        }, function() {                    
            // Handle successful uploads on complete
            
            commit('setPostImageUploadStatus', true)
            // Get the download URL: https://firebasestorage.googleapis.com/...
            uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                console.log('File available at', downloadURL);
            });
        });

    },
    fetchAllPosts({commit, state}) {
        const postsInfoRef = fb.db().ref('posts_info/')
        const postsContentRef = fb.db().ref('posts_content/')
        const displayImageRef = fb.storage().ref('display_images/')
    },
    addFullPost({commit, state, dispatch}, newPost) {
        console.log('Adding post id to state...')
        if (!!newPost.updated) {
            dispatch('checkIfPostIsNew', newPost.id)
        }
        else if (newPost.singlePost === undefined) commit('addPostIdToState', {postId: newPost.id, unshift: false})
        const postsContentRef = fb.db().ref('posts_content/')
        const displayImageRef = fb.storage().ref('display_images/')
        const postsInfoRef = fb.db().ref('posts_info/')
        const fullPost = {
            info: '',
            content: '',
            displayImageURL: '',
            id: newPost.id,
            timestamp: newPost.timestamp
        }
        postsInfoRef.child(newPost.id).once('value', (snapshot) => {
            fullPost.info = snapshot.val()
        }).then(() => {
            postsContentRef.child(newPost.id).once('value', (snapshot) => {
                fullPost.content = snapshot.val()
            }).then(() => {
                displayImageRef.child(newPost.id).getDownloadURL().then(url => {
                    fullPost.displayImageURL = url
                    if (newPost.singlePost) commit('addSinglePostToState', fullPost)
                    else commit('addFullPostToState', fullPost)
                }, error => {console.log(error)})
            })
        })
        
    },
    checkIfPostIsNew({commit, state}, postId) {
        state.lists.posts.forEach((id, index) => {
            if (id === postId) {
                count++
                commit('deleteFullPostToState', {index, id})
            }
        })
        commit('addPostIdToState', {postId, unshift: true})
    },
    processImageOnServer({commit, state}, imageFile) {
        console.log(imageFile)
        let formData = new FormData()
        formData.append('file', imageFile)
        fetch( `${API_URL}/processImage`,
            {
                method: 'POST',
                headers: {
                    
                },
                body: formData
            }
        ).then(function(response){
            console.log('SUCCESS!!');
            let imageFile = new Buffer(response.data, 'binary')
            commit('updateNewPostDisplayImage', imageFile)
        })
        .catch(function(error){
            console.log(error)
        })
    },
    sendAcceptAdminRequest({commit}, id) {
        axios.get(`${API_URL}/admin/approve/${id}`)
                .then(res => {
                    console.log('Admin Request Accepted: ' + id )
                    commit('deleteAdminRequestFromState', id)
                })
                .catch(error => {
                    console.log(error)
                })
    }
}
const mutations = {
    setCurrentUser(state, value) {
        state.currentUser = value
    },
    setAdmin(state, value) {
        state.isAdmin = value
    },
    setRequestAdminPending(state, value) {
        state.requestAdminPending = value
    },
    setPostImageUploadError(state, value) {
        state.uploadPostStatus.toFirebaseStorage.error = value
    },
    setPostImageUploadStatus(state, value) {
        state.uploadPostStatus.toFirebaseStorage.success = value
    },
    setPostUploadError(state, value) {
        state.uploadPostStatus.toFirebaseDb.error = value
    },
    setPostUploadStatus(state, value) {
        state.uploadPostStatus.toFirebaseDb.success = value
    },
    updateNewPostTitle(state, value) {
        state.newPost.info.title = value
    },
    updateNewPostShortDescription(state, value) {
        state.newPost.info.short_description = value
    },
    updateNewPostContent(state, value) {
        state.newPost.content = value
    },
    updateNewPostDisplayImage(state, value) {
        state.newPost.displayImageFile = value
    },
    resetNewPost(state) {
        const reset = initialState()
        state.newPost = reset.newPost
        state.uploadPostStatus = reset.uploadPostStatus
    },
    addPostIdToState(state, {postId, unshift}) {
        if (!!unshift) state.lists.posts.unshift(postId)
        else state.lists.posts.push(postId)
    },
    addFullPostToState(state, fullPost) {
        console.log('Add FULL PoST to state')
        const postId = fullPost.id
        Vue.set(state.allPosts, postId, fullPost)
    },
    deleteFullPostToState(state, {index, id}) {
        delete state.allPosts[id]
        state.lists.posts.splice(index, 1)
    },
    addSinglePostToState(state, fullPost) {
        state.singlePost = fullPost
    },
    removeSinglePost(state) {
        state.singlePost = null
    },
    addAdminRequestToState(state, request) {
        state.allAdminRequests.push(request)
    },
    addEditingPostToState(state, post) {
        state.editingPost = post
    },
    deleteEditingPostFromState(state) {
        state.editingPost = null
    },
    updateEditingPostContent(state, value) {
        state.editingPost.content = value
    },
    updateEditingPostShortDescription(state, value) {
        state.editingPost.info.short_description = value
    },
    updateEditingPostTitle(state, value) {
        state.editingPost.info.title = value
    },
    deleteAdminRequestFromState(state, value) {
        state.allAdminRequests.forEach((request, i) => {
            if (request.id === value) state.allAdminRequests.splice(i, 1)
        })
    }
}

export const store = new Vuex.Store({
    state: initialState(),
    getters,
    actions,
    mutations
})