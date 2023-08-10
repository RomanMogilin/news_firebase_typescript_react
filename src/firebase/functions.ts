import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, Firestore, DocumentData } from 'firebase/firestore';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { CHANGE_AUTH, SET_USER_UID } from "../store/consts";
import { store } from '../store/store';

const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID,
};

const app = initializeApp(firebaseConfig);
const dataBase: Firestore = getFirestore(app);
export const auth = getAuth(app);

/**
 * @param path - отвечает за то в какой коллекции на **Firebase**, будет взят список документов.
 * @returns массив из объектов хранящихся по данному `path` в **Firestore Firebase**
 */
export const getDocsByPath = async (path: string) => {
    const documents = collection(dataBase, `${path}`);
    const documentSnapshot = await getDocs(documents);
    const documentList = documentSnapshot.docs.map(doc => doc.data());
    return documentList;
}

/**
 * @param email - принимает email пользователя
 * @param password - принимает пароль пользователя
 * @description Функция производит регестрацию пользователя на **Firebase Authentication**
 */
export const signUp = async (email: string, password: string) => {
    console.log('Регистрация пользователя')
    let userUid: string = '';
    let isCompleted: boolean = false;
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            isCompleted = true;
            const user = userCredential.user;
            userUid = user.uid
            console.log(user)
            userUid = user.uid
            store.dispatch({ type: SET_USER_UID, payload: user.uid })
            store.dispatch({ type: CHANGE_AUTH })
            console.log(user.uid)
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(`Error Code: ${errorCode}; Error Message: ${errorMessage}`)
        });
}

/**
 * @param email - принимает email пользователя
 * @param password - принимает пароль пользователя
 * @description Функция производит авторизацию пользователя
 */
export const signIn = async (email: string, password: string) => {
    console.log('Вход в аккаунт')
    let userUid: string = '';
    let isCompleted: boolean = false;
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            isCompleted = true;
            const user = userCredential.user;
            userUid = user.uid
            store.dispatch({ type: SET_USER_UID, payload: user.uid })
            store.dispatch({ type: CHANGE_AUTH })
            console.log(user)
            console.log(user.uid)
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(`Error Code: ${errorCode}; Error Message: ${errorMessage}`)
        });
}