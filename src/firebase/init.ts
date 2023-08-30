import { initializeApp } from "firebase/app";
import { getFirestore, Firestore } from 'firebase/firestore';
import { Auth, getAuth } from "firebase/auth";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { store } from "../store/store";
import { EDIT_USER_PROFILE_PHOTO } from "../store/consts";
import { updateFirestoreCollectionField } from "./firestore";


const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const dataBase: Firestore = getFirestore(app);
export const authentication: Auth = getAuth(app);

const storage = getStorage();

export const addImg = async (path: string, file: File, userUid: string, collection: string) => {
    let imgRef = ref(storage, `images/${path}`)
    return uploadBytes(imgRef, file).then((res) => {
        console.log(res)
        return getImg(`images/${path}`, userUid, collection)
    }).catch((err) => console.log(err))
}

export const getImg = async (path: string, userUid: string, collection: string) => {
    const storage = getStorage();
    const imageRef = ref(storage, path);
    // Get the download URL
    return getDownloadURL(imageRef)
        .then((url) => {
            console.log(url)
            alert(collection === 'users')
            if (collection === 'users') {

            }
            return url
            // Insert url into an <img> tag to "download"
        })
}