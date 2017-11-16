import * as firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyBDkqkKq86OrkjaMGZV2BhfaIUurtU6_YU",
  authDomain: "eiu-chatting-c99ce.firebaseapp.com",
  databaseURL: "https://eiu-chatting-c99ce.firebaseio.com",
  projectId: "eiu-chatting-c99ce",
  storageBucket: "eiu-chatting-c99ce.appspot.com",
  messagingSenderId: "240547459563"
};

export const firebaseApp = firebase.initializeApp(firebaseConfig);