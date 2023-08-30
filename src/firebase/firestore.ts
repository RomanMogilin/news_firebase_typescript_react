import { collection, deleteDoc, doc, getDoc, getDocs, setDoc, updateDoc } from "firebase/firestore"
import { addImg, dataBase } from "./init"
import { ADD_NEWS_ONE, ADD_USER_POST, ADD_USER_REACTION, DELETE_NEWS_ONE, DELETE_NEWS_POST_COMMENT, DELETE_USER_POST, DELETE_USER_REACTION, EDIT_USER_DATE_OF_REGISTRATON, EDIT_USER_DESCRIPTION, EDIT_USER_NAME, EDIT_USER_PROFILE_PHOTO } from "../store/consts"
import { store } from "../store/store"
import { PostComment, PostContent, PostsOfFirebaseCollectionPosts, Reaction, StorePost, UserFirebaseStore, UserReaction } from "../store/types"

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
    store.dispatch({ type: DELETE_USER_POST, deleteUserPost: postId })
    store.dispatch({ type: DELETE_NEWS_ONE, deleteNewsOne: postId })
}

/**
 * @param postId id поста на базе данных
 * @param content это массив с изменениями новости
 */
export const editPost = async (postId: string, content: PostContent, reaction: Reaction) => {

    let posts = store.getState().user.posts;
    let post: StorePost | undefined = posts.find((post: StorePost) => {
        return post.id === postId
    })
    if (post) {
        let postRef = doc(dataBase, 'posts', postId)
        await updateDoc(postRef, {
            content: content,
            reaction: reaction,
        })

        store.dispatch({ type: DELETE_USER_POST, deleteUserPost: postId });
        store.dispatch({ type: DELETE_NEWS_ONE, deleteNewsOne: postId });

        const newStorePost: Readonly<StorePost> = {
            id: postId,
            date: post.date,
            author: post.author,
            content: content,
            reaction: reaction,
            comments: post.comments
        }

        store.dispatch({ type: ADD_USER_POST, addUserPost: newStorePost });
        console.log('EditPost:', newStorePost);
        store.dispatch({ type: ADD_NEWS_ONE, addNewsOne: newStorePost });
    }
    else {
        return new Error('editPost: error')
    }
}

export const docExists = async (collection: string, id: string) => {
    const docRef = doc(dataBase, collection, id);
    const docSnap = await getDoc(docRef);
    let docSnapExist = docSnap.exists();
    return { exist: docSnapExist, postId: id };
}

export const addComment = async (postId: string, commentDate: PostComment) => {
    const postRef = doc(dataBase, 'posts', postId)
    const comments: [] | PostComment[] | undefined = store.getState().news.posts.find((post: StorePost) => post.id === postId)?.comments
    comments && console.log('firestore.ts addComment:', [commentDate, ...comments])
    comments && await updateDoc(postRef, {
        comments: [commentDate, ...comments]
    })
}

export const test = async () => {
    let testRef = doc(dataBase, 'test/PtDMcK10D3x4MZxr4C6c/comments', 'w6Mn9OI9CCe9cgy3EMTt')
    let testSnap = await getDoc(testRef)
    if (testSnap.exists()) {
        console.log("Document data:", testSnap.data());
    } else {
        // docSnap.data() will be undefined in this case
        console.log("No such document!");
    }
}

export const getDocFromFirebase = async (collection: string, id: string) => {
    const docRef = doc(dataBase, collection, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        if (collection === 'users') {
            return docSnap.data() as UserFirebaseStore;
        }
        else if (collection === 'posts') {
            return { ...docSnap.data(), id } as StorePost;
        }
        else {
            return null
        }
    }
    else {
        return null
    }
}

export const deleteComment = async (commentId: string, postId: string) => {
    console.log('deleteComment-postId:', postId)
    console.log('deleteComment-commentId:', commentId)
    const postRef = doc(dataBase, 'posts', postId)
    console.log('deleteComment-posts:', store.getState().news.posts)
    const comments: [] | PostComment[] | undefined = store.getState().news.posts.find((post: StorePost) => {
        return post.id === postId
    })?.comments
    console.log('deleteComment-comments:', comments)
    comments && console.log('deleteComment-filtered-comments:', [...comments].filter((comment: PostComment) => comment.id !== commentId))
    comments && await updateDoc(postRef, {
        comments: [...comments].filter((comment: PostComment) => comment.id !== commentId)
    })
    comments && store.dispatch({
        type: DELETE_NEWS_POST_COMMENT, deleteNewsPostComment: {
            postId, commentId
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
        comments: []
    }

    const newStorePost: Readonly<StorePost> = {
        id: `${currentTime}`,
        date: currentTime,
        author: userUid,
        content: content,
        reaction: newReaction,
        comments: []
    }

    await setDoc(postRef, newFirebasePost)
    store.dispatch({ type: ADD_USER_POST, addUserPost: newStorePost })
    store.dispatch({ type: ADD_NEWS_ONE, addNewsOne: newStorePost })
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
        const postSnapDate = postSnap.data() as PostsOfFirebaseCollectionPosts

        if (postSnap.exists() && postSnap) {
            store.dispatch({ type: ADD_USER_POST, addUserPost: { ...postSnapDate, id: id } })
        }
    }

    if (userSnap.exists() && userSnap) {
        console.log('userSnap.data():', userSnap.data())
        const userSnapDate = userSnap.data() as UserFirebaseStore
        userSnapDate.posts.forEach((postId: string) => { getPostById(postId) })
        store.dispatch({ type: EDIT_USER_DATE_OF_REGISTRATON, editUserDateOfRegistration: userSnapDate.dateOfRegistration })
        store.dispatch({ type: EDIT_USER_NAME, editUserName: userSnapDate.userName })
        store.dispatch({ type: EDIT_USER_PROFILE_PHOTO, editUserProfilePhoto: userSnapDate.profilePhoto })
        store.dispatch({ type: EDIT_USER_DESCRIPTION, editUserDescription: userSnapDate.description })
        userSnapDate.reaction.forEach((reaction: UserReaction) => {
            console.log('reaction:', reaction)
            console.log('reaction:', reaction.postId)
            console.log('reaction:', reaction.reaction)
            !!!reaction.commentId && docExists('posts', reaction.postId).then((res) => console.log('getUserDateByUid:', reaction.postId, res))
            let newReaction: UserReaction = { postId: reaction.postId, reaction: reaction.reaction, postHeader: reaction.postHeader }
            if (reaction.commentId !== undefined) {
                console.log('firestore.ts|sign In|commentExistCondition:', reaction, ", reaction.commentId:", reaction.commentId, ", reaction.commentHeader:", reaction.commentHeader)
                newReaction.commentId = reaction.commentId;
                newReaction.commentHeader = reaction.commentHeader;
            }
            store.dispatch({ type: ADD_USER_REACTION, addUserReaction: newReaction })
            !!!reaction.commentId && docExists('posts', reaction.postId).then((res) => {
                console.log('getUserDateByUid:', reaction.postId, res)
                if (res.exist === false) {
                    let userReaction = store.getState().user.reaction;
                    // updateFirestoreCollectionField('users', userUid, { reaction: [...userReaction.filter((currentReaction: UserReaction) => currentReaction.postId === reaction.postId)] })
                    updateFirestoreCollectionField('users', userUid, { reaction: [...userReaction.filter((currentReaction: UserReaction) => currentReaction.postId !== reaction.postId)] })
                    store.dispatch({ type: DELETE_USER_REACTION, deleteUserReaction: { postId: reaction.postId } })
                }
            })
        })
    }
}

export const addUser = async (userUid: string, dateOfRegistration: string) => {
    await setDoc(doc(dataBase, `users`, userUid), {
        posts: [],
        dateOfRegistration: dateOfRegistration,
        userName: dateOfRegistration,
        profilePhoto: 'empty',
        description: 'empty',
    })
}

export const updateFirestoreCollectionField = async (collectionName: string, docId: string, changes: any) => {
    let docRef = doc(dataBase, collectionName, docId)
    await updateDoc(docRef, {
        ...changes
    }).catch((err) => console.log(err))
}