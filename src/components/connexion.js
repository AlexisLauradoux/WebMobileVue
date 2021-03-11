import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import store from "../store/index";

var firebaseConfig = {
    apiKey: "AIzaSyC_olOtBo0JDAva2BlAYHWvfF12C3nGg7A",
    authDomain: "webmobile-4e5cc.firebaseapp.com",
    databaseURL: "https://webmobile-4e5cc-default-rtdb.firebaseio.com",
    projectId: "webmobile-4e5cc",
    storageBucket: "webmobile-4e5cc.appspot.com",
    messagingSenderId: "900416919059",
    appId: "1:900416919059:web:4772b44789bfa469f151e6",
    measurementId: "G-7BPJWH4N90",
  };


firebase.initializeApp(firebaseConfig);

firebase.auth().onAuthStateChanged(user => {
  store.dispatch("fetchUser", user);
});

export const db = firebase.database()
export const _firebase = firebase;

