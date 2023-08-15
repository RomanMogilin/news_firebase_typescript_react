import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { authentication } from "./init";
import { store } from "../store/store";
import { EDIT_AUTH, EDIT_USER_UID } from "../store/consts";
import { addUser, getUserDateByUid } from "./firestore";

/**
 * @param email - принимает email пользователя
 * @param password - принимает пароль пользователя
 * @description Функция производит регестрацию пользователя на **Firebase Authentication**
 */
export const signUp = async (email: string, password: string) => {
    console.log('Регистрация пользователя')
    createUserWithEmailAndPassword(authentication, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            user.metadata.creationTime && addUser(user.uid, `${Date.parse(`${user.metadata.creationTime}`)}`)
            store.dispatch({ type: EDIT_USER_UID, payload: user.uid })
            store.dispatch({ type: EDIT_AUTH })
            console.log(user)
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(`Error Code: ${errorCode}; Error Message: ${errorMessage}`)
            alert(errorMessage)
        });
}

/**
 * @param email - принимает email пользователя
 * @param password - принимает пароль пользователя
 * @description Функция производит авторизацию пользователя
 */
export const signIn = async (email: string, password: string) => {
    console.log('Вход в аккаунт')
    signInWithEmailAndPassword(authentication, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            store.dispatch({ type: EDIT_USER_UID, payload: user.uid })
            store.dispatch({ type: EDIT_AUTH })
            getUserDateByUid(user.uid)
            console.log(user)
            console.log(user.uid)
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(`Error Code: ${errorCode}; Error Message: ${errorMessage}`)
            alert(errorMessage)
        });
}