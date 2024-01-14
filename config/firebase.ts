import firebase from "firebase/app";
import 'firebase/database'

const firebaseConfig = {
    apiKey: "AIzaSyDAkQJALGE_nvAzzDpsIYRO37vSOtmORm4",
    authDomain: "agendanext-23439.firebaseapp.com",
    projectId: "agendanext-23439",
    storageBucket: "agendanext-23439.appspot.com",
    messagingSenderId: "644788458516",
    appId: "1:644788458516:web:52a7db9b8c7934195f8301"
    };

    if(!firebase.apps.length){
        firebase.initializeApp(firebaseConfig)
    }else{
        firebase.app()
    }

const db = firebase.database();

export {db, firebase}