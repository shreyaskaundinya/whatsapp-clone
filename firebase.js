import firebase from 'firebase';

const firebaseConfig = {
    apiKey: 'AIzaSyC0bsTgFc7y3dJT1t-wuiH3rHzlixnGr20',
    authDomain: 'whatsapp-clone-83b7c.firebaseapp.com',
    projectId: 'whatsapp-clone-83b7c',
    storageBucket: 'whatsapp-clone-83b7c.appspot.com',
    messagingSenderId: '600365983953',
    appId: '1:600365983953:web:96eb9d82f6a252585b3df0',
};

const app = !firebase.apps.length
    ? firebase.initializeApp(firebaseConfig)
    : firebase.app();

const db = app.firestore();
const auth = app.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { db, auth, provider };
