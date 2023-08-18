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

export interface Reaction {
    likes: number,
    views: number,
    dislikes: number,
}

export type PostsOfFirebaseCollectionUsers = string[]


export interface PostsOfFirebaseCollectionPosts {
    author: string,
    date: number,
    reaction: Reaction,
    content: PostContent
}

export interface StorePost extends PostsOfFirebaseCollectionPosts {
    id: string
}

export interface UserReaction {
    postId: string,
    reaction: 'like' | 'dislike',
}

export interface UserStore {
    dateOfRegistration: string,
    userName: string,
    posts: [] | StorePost[],
    reaction: [] | UserReaction[]
}

export interface userAction extends Action {
    payload: string | StorePost[] | UserReaction | any
}

export interface newsAction extends Action {
    payload: {
        editNews: StorePost[] | [],
        editNewsReaction: {
            ReactionType: 'view' | 'like' | 'dislike',
            postId: string,
            count: number
        }
        editNewsLikesAndDislikes: {
            postId: string,
            likes: number,
            dislikes: number,
        }
    }
    // UserReaction | StorePost[] | any
}

/**
 * @description Type для state **`authReducer`**
 */
export interface AuthStore {
    isAuth: boolean,
    userUid: string
}

export interface NewsStore {
    posts: StorePost[] | []
}

/**
 * @description Type для state в useSelector
 */
export interface GlobalStore {
    auth: AuthStore,
    user: UserStore,
    news: NewsStore
}