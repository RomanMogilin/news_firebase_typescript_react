import { collection, deleteDoc, doc, getDoc, getDocs, setDoc, updateDoc } from "firebase/firestore"
import { dataBase } from "./init"
import { ADD_POST, DELETE_POST, EDIT_DATE_OF_REGISTRATON, EDIT_USER_NAME } from "../store/consts"
import { store } from "../store/store"
import { PostContent, StorePost } from "../store/types"

/**
 * @returns возвращает все новости из базы данных
 */
export const getPosts = async () => {
    const querySnapshot = await getDocs(collection(dataBase, "posts"))
    return querySnapshot
}

/**
 * @param userUid id пользователя на базе данных
 * @param newName новое имя пользователя
 */
export const setUserName = async (userUid: string, newName: string) => {
    const userRef = doc(dataBase, 'users', userUid)
    await updateDoc(userRef, {
        userName: newName
    })
}

/**
 * @param postId id поста на базе данных
 * @param userUid id пользователя на базе данных
 */
export const deletePost = async (postId: string, userUid: string) => {
    let userRef = doc(dataBase, 'users', userUid)
    let postRef = doc(dataBase, 'posts', postId)

    type FirebasePosts = StorePost[] | []
    console.log(store.getState())
    let firebasePosts: FirebasePosts = store.getState().user.posts
    let firebasePostsFiltered: string[] = [...firebasePosts].map((post: any) => post.id).filter((postIdentifire: string) => postIdentifire !== postId)

    await updateDoc(userRef, {
        posts: [...firebasePostsFiltered]
    })
    await deleteDoc(postRef)
    store.dispatch({ type: DELETE_POST, payload: postId })
}

/**
 * @param postId id поста на базе данных
 * @param content это массив с изменениями новости
 */
export const editPost = async (postId: string, content: PostContent) => {

    let postRef = doc(dataBase, 'posts', postId)
    await updateDoc(postRef, {
        content: content
    })

    let posts = store.getState().user.posts;
    let post = posts.find((post: any) => {
        return post.id === postId
    })

    console.log(`Edit post: `, post)

    store.dispatch({ type: DELETE_POST, payload: postId })
    store.dispatch({
        type: ADD_POST, payload: {
            id: postId,
            date: post.date,
            author: post.author,
            content: content
        }
    })
}

export const addPost = async (userUid: string, content: PostContent) => {
    type FirebasePosts = StorePost[] | []

    let firebasePosts: FirebasePosts = store.getState().user.posts
    let firebasePostsAfterMap: string[] = [...firebasePosts].map((post: any) => { return post.id })

    let currentTime = Date.now()

    let userRef = doc(dataBase, 'users', userUid)
    let postRef = doc(dataBase, 'posts', `${currentTime}`)

    await updateDoc(userRef, {
        posts: [...firebasePostsAfterMap, `${currentTime}`]
    })
    await setDoc(postRef, {
        author: userUid,
        date: currentTime,
        content: content
    })
    store.dispatch({
        type: ADD_POST, payload: {
            id: `${currentTime}`,
            date: currentTime,
            author: userUid,
            content: content
        }
    })
}

/**
 * @param userUid id пользователя в базе данных
 * @description получает данные (дату регистрации, посты пользователя) и записывает их в store
 */
export const getUserDateByUid = async (userUid: string) => {

    const userRef = doc(dataBase, 'users', userUid)
    const userSnap = await getDoc(userRef)

    const getPostById = async (id: string) => {
        const postRef = doc(dataBase, 'posts', id)
        const postSnap = await getDoc(postRef)
        if (postSnap.exists() && postSnap) {
            store.dispatch({ type: ADD_POST, payload: { ...postSnap.data(), id: id } })
        }
    }

    if (userSnap.exists() && userSnap) {
        userSnap.data().posts.forEach((postId: string) => { getPostById(postId) })
        store.dispatch({ type: EDIT_DATE_OF_REGISTRATON, payload: userSnap.data().dateOfRegistration })
        store.dispatch({ type: EDIT_USER_NAME, payload: userSnap.data().userName })
    }
}

export const addUser = async (userUid: string, dateOfRegistration: string) => {
    await setDoc(doc(dataBase, `users`, userUid), {
        posts: [],
        dateOfRegistration: dateOfRegistration,
        userName: dateOfRegistration
    })
}