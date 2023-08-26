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

export interface PostComment {
    id: string,
    author: string,
    text: string,
    commentReaction: {
        likes: number,
        dislikes: number,
    },
    commentDependences: string[] | null
}

export type PostsOfFirebaseCollectionUsers = string[]


export interface PostsOfFirebaseCollectionPosts {
    author: string,
    date: number,
    reaction: Reaction,
    content: PostContent,
    comments: [] | PostComment[]
}

export interface StorePost extends PostsOfFirebaseCollectionPosts {
    id: string
}

export interface UserReaction {
    postId: string,
    reaction: 'like' | 'dislike',
    commentId?: string
}

export interface UserStore {
    dateOfRegistration: string,
    userName: string,
    posts: [] | StorePost[],
    reaction: [] | UserReaction[]
}

export interface UserFirebaseStore {
    dateOfRegistration: string,
    userName: string,
    posts: [] | string[],
    reaction: [] | UserReaction[]
}

export interface userAction extends Action {
    editUserName: string,
    editUserDateOfRegistration: string,
    addUserPost: StorePost,
    deleteUserPost: string,
    addUserReaction: UserReaction,
    editUserReaction: UserReaction,
    deleteUserReaction: {
        postId: string,
        commentId?: string,
    },
}

export interface newsAction extends Action {
    editNews: StorePost[] | [],
    editNewsReaction: {
        ReactionType: 'view' | 'like' | 'dislike',
        postId: string,
        count: number
    },
    editNewsLikesAndDislikes: {
        postId: string,
        likes: number,
        dislikes: number,
    },
    addNewsOne: StorePost,
    deleteNewsOne: string, // postId
    addNewsPostComment: {
        post: StorePost,
        newComment: PostComment,
    },
    deleteNewsPostComment: {
        postId: string,
        commentId: string,
    },
    addNewsPostCommentReaction: UserReaction,
    editNewsPostCommentReaction: {},
    deleteNewsPostCommentReaction: {},
    editNewsPostCommentReactionLikesAndDislikes: {
        postId: string,
        commentId: string,
        likes: number,
        dislikes: number,
    },
}

/**
 * @description Type для state **`authReducer`**
 */
export interface AuthStore {
    isAuth: boolean,
    userUid: string
}

export interface NewsStore {
    posts: StorePost[] | [],
    loading: boolean
}

/**
 * @description Type для state в useSelector
 */
export interface GlobalStore {
    auth: AuthStore,
    user: UserStore,
    news: NewsStore
}