import { collection, deleteDoc, doc, getDoc, getDocs, setDoc, updateDoc } from "firebase/firestore"
import { dataBase } from "./init"
import { ADD_POST, ADD_USER_REACTION, DELETE_POST, EDIT_DATE_OF_REGISTRATON, EDIT_USER_NAME } from "../store/consts"
import { store } from "../store/store"
import { PostContent, PostsOfFirebaseCollectionPosts, Reaction, StorePost, UserReaction } from "../store/types"

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
export const editPost = async (postId: string, content: PostContent, reaction: Reaction) => {

    let postRef = doc(dataBase, 'posts', postId)
    await updateDoc(postRef, {
        content: content,
        reaction: reaction,
    })

    let posts = store.getState().user.posts;
    let post = posts.find((post: any) => {
        return post.id === postId
    })

    console.log(`Edit post: `, post)

    store.dispatch({ type: DELETE_POST, payload: postId })

    const newStorePost: Readonly<StorePost> = {
        id: postId,
        date: post.date,
        author: post.author,
        content: content,
        reaction: reaction
    }

    store.dispatch({
        type: ADD_POST, payload: newStorePost
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
        posts: [...firebasePostsAfterMap, `${currentTime}`],
    })

    let newReaction: Readonly<Reaction> = {
        likes: 0,
        dislikes: 0,
        views: 0,
    }

    const newFirebasePost: Readonly<PostsOfFirebaseCollectionPosts> = {
        author: userUid,
        date: currentTime,
        content: content,
        reaction: newReaction,
    }

    const newStorePost: Readonly<StorePost> = {
        id: `${currentTime}`,
        date: currentTime,
        author: userUid,
        content: content,
        reaction: newReaction
    }

    await setDoc(postRef, newFirebasePost)
    store.dispatch({ type: ADD_POST, payload: newStorePost })
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
        userSnap.data().reaction.forEach((reaction: UserReaction) => { store.dispatch({ type: ADD_USER_REACTION, payload: { postId: reaction.postId, reaction: reaction.reaction } }) })
    }
}

export const addUser = async (userUid: string, dateOfRegistration: string) => {
    await setDoc(doc(dataBase, `users`, userUid), {
        posts: [],
        dateOfRegistration: dateOfRegistration,
        userName: dateOfRegistration
    })
}

export const updateFirestoreCollectionField = async (collectionName: string, docId: string, changes: any) => {
    let docRef = doc(dataBase, collectionName, docId)
    await updateDoc(docRef, {
        ...changes
    }).catch((err) => console.log(err))
}

// Reaction

// export const addReaction = async (postId: string, like: boolean, isUserReact: boolean) => {
//     store.dispatch({
//         type: EDIT_NEWS_REACTION, payload: {
//             postId: postId,
//             like: like,
//             isUserReact: isUserReact
//         }
//     })
// }
// export const deleteReaction = async () => { }