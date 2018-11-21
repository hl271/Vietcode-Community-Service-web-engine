const functions = require('firebase-functions')
const admin = require('firebase-admin')
const express = require('express')
const app = express()
const cors = require('cors')({origin: true})

// // TODO: constructing '/processImage' API
// const sharp = require('sharp')
// const fileType = require('file-type')
// const multer = require('multer')
// const upload = multer({dest: 'uploads/'})

admin.initializeApp()

app.use(cors)
// app.use(multer({dest: 'uploads/'}).single('file'))
app.get('/hello', (req, res) => {
    res.send('Hello Master!')
})

// app.post('/processImage', upload.single('file'), (req, res) => {
//     let imageFile = req.file
//     console.log(imageFile)
//     console.log(req.files)
//     console.log(req.body)
//     sharp(imageFile)
//         .resize(300, 300)
//         .toBuffer()
//         .then(result => {
//             res.send(result)
//         })
//         .catch(error => {
//             console.log(error)
//             res.status(503).end()
//         })
    
// })

app.get('/admin/approve/:id', (req, res) => {
    const id = req.params.id
    const adminReqRef = admin.database().ref('admin-request/')
    adminReqRef.child(id).once('value', snapshot => {
        if (snapshot.exists()) {
            admin.auth()
                .setCustomUserClaims(id, {admin: true})
                .then(() => {
                    adminReqRef.child(id).remove()
                    res.status(200).end()
                })
                .catch(error => {
                    console.log(error)
                    res.status(500).end()
                })
        }
        else {
            res.status(404).end()
        }
    })
})

exports.app = functions.https.onRequest(app)
// admin.auth().setCustomUserClaims('9mQOkm14UQcCWI2M7QQNWwpvp0R2', {admin: true}).then(() => {
//     // The new custom claims will propagate to the user's ID token the
//     // next time a new one is issued.
//     console.log('Successfully add Lan as admin!!!!')
// });