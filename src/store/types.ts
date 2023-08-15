export interface Action {
    type: string,
}

export interface AuthAction extends Action {
    payload?: string
}

export interface PostContent {
    header: string,
    anons: string,
    text: string,
    anons_img: string,
}

export type PostsOfFirebaseCollectionUsers = string[]


export interface PostsOfFirebaseCollectionPosts {
    author: string,
    date: number,
    content: PostContent
}

export interface StorePost extends PostsOfFirebaseCollectionPosts {
    id: string
}

export interface UserStore {
    dateOfRegistration: string,
    userName: string,
    posts: [] | StorePost[] | any[]
}

export interface userAction extends Action {
    payload: string | StorePost[] | any
}

/**
 * @description Type для state **`authReducer`**
 */
export interface AuthStore {
    isAuth: boolean,
    userUid: string
}

/**
 * @description Type для state в useSelector
 */
export interface GlobalStore {
    auth: AuthStore,
    user: UserStore
}