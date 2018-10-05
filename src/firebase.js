import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/storage'

const config = {
    apiKey: "AIzaSyAX9zZChEPkWBva_p_9VbdlhFvyMEkNlCE",
    authDomain: "vcswebdemo.firebaseapp.com",
    databaseURL: "https://vcswebdemo.firebaseio.com",
    projectId: "vcswebdemo",
    storageBucket: "vcswebdemo.appspot.com",
    messagingSenderId: "927003966532"
  };
  
firebase.initializeApp(config);

// firebase utils
const db = firebase.database
const auth = firebase.auth
const currentUser = auth().currentUser
const storage = firebase.storage

export default {
    db,
    auth,
    currentUser,
    storage
}