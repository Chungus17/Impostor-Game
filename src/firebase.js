import firebase from "firebase/compat/app";
import "firebase/compat/database";

const firebaseConfig = {
  
};

firebase.initializeApp(firebaseConfig);

export const db = firebase.database();