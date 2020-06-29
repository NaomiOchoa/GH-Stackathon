import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

var firebaseConfig = {
  apiKey: "AIzaSyCwl5LmI9A220WNsCAgvWuxv2Myb2VMh4Y",
  authDomain: "wd-time-tracker.firebaseapp.com",
  databaseURL: "https://wd-time-tracker.firebaseio.com",
  projectId: "wd-time-tracker",
  storageBucket: "wd-time-tracker.appspot.com",
  messagingSenderId: "224647763465",
  appId: "1:224647763465:web:345089a3c18264c5d9cad8",
  measurementId: "G-WQ7YZ5FT85",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const firestore = firebase.firestore();
export const auth = firebase.auth();

export const provider = new firebase.auth.GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const { user } = await firebase.auth().signInWithPopup(provider);
    console.log(user);
  } catch (error) {
    // var errorCode = error.code;
    // var errorMessage = error.message;
    // // The email of the user's account used.
    // var email = error.email;
    // // The firebase.auth.AuthCredential type that was used.
    // var credential = error.credential;
    console.error(error);
    // ...
  }
};

export const signOut = () => auth.signOut();

export const getUserProfileDoc = async (uid) => {
  if (!uid) {
    return null;
  }
  try {
    const userProfileDoc = await firestore.collection("users").doc(uid);
    return userProfileDoc;
  } catch (error) {
    console.error(error);
  }
};

export const createUserProfileDoc = async (user, additionalData) => {
  if (!user) {
    return;
  }
  const userRef = firestore.doc(`users/${user.uid}`);
  const snapshot = await userRef.get();

  if (!snapshot.exists) {
    const { displayName, email } = user;
    const createdAt = new Date();
    try {
      await userRef.set({
        displayName,
        email,
        createdAt,
        ...additionalData,
      });
    } catch (error) {
      console.error(error);
    }
  }
  return getUserProfileDoc(user.uid);
};

export default firebase;
