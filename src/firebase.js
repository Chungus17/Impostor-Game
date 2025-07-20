import firebase from "firebase/compat/app";
import "firebase/compat/database";

const firebaseConfig = {
  apiKey: "AIzaSyBUTn0kBo1k4XvJ4UkNCQj2onw-LqHF9D0",
  authDomain: "impostor-game-30bda.firebaseapp.com",
  databaseURL: "https://impostor-game-30bda-default-rtdb.firebaseio.com",
  projectId: "impostor-game-30bda",
  storageBucket: "impostor-game-30bda.firebasestorage.app",
  messagingSenderId: "348170722047",
  appId: "1:348170722047:web:2c491dc8d1204128e10aca"
};

firebase.initializeApp(firebaseConfig);

export const db = firebase.database();