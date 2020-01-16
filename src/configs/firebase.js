import firebase from 'firebase'

const config = {
    apiKey: 'AIzaSyAa6hkR7KE6VOg2xhPsx6-Ljb80VuFDsN8',
    authDomain: 'rnchat-e65b0.firebaseapp.com',
    databaseURL: 'https://rnchat-e65b0.firebaseio.com',
    projectId: 'rnchat-e65b0',
    storageBucket: 'gs://rnchat-e65b0.appspot.com',
    messagingSenderId: '851660706627'
}

export default firebase.initializeApp(config)
