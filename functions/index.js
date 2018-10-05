const functions = require('firebase-functions')
const admin = require('firebase-admin')

admin.initializeApp()

admin.auth().setCustomUserClaims('9mQOkm14UQcCWI2M7QQNWwpvp0R2', {admin: true}).then(() => {
    // The new custom claims will propagate to the user's ID token the
    // next time a new one is issued.
    console.log('Successfully add Lan as admin!!!!')
});