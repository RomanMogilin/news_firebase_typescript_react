import { EDIT_NEWS_REACTION, EDIT_NEWS, EDIT_NEWS_LIKES_AND_DISLIKES, ADD_NEWS_ONE, ADD_NEWS_POST_COMMENT, DELETE_NEWS_POST_COMMENT, EDIT_NEWS_LOADING, EDIT_NEWS_POST_COMMENT_REACTION_LIKES_AND_DISLIKES, DELETE_NEWS_ONE } from "../consts"
import { NewsStore, PostComment, StorePost, newsAction } from "../types"

const newsInitialStore: NewsStore = {
    posts: [],
    loading: false,
}

export const newsReducer = (state = newsInitialStore, action: newsAction) => {
    switch (action.type) {
        case EDIT_NEWS: return { ...state, posts: action.editNews }
        case EDIT_NEWS_REACTION: {
            console.log('reducer: news; case: EDIT_NEWS_REACTION', action.editNewsReaction)
            const newPosts: StorePost[] = [...state.posts].map((post: StorePost) => {
                if (post.id === action.editNewsReaction.postId) {
                    let newPost = { ...post }
                    // console.log('find the post in Reducer')
                    // console.log(action)
                    // console.log(action.payload.editNewsReaction)
                    switch (action.editNewsReaction.ReactionType) {
                        case 'view': { newPost.reaction.views = action.editNewsReaction.count; console.log('Reducer views'); break }
                        case 'like': { newPost.reaction.likes = action.editNewsReaction.count; break }
                        case 'dislike': { newPost.reaction.dislikes = action.editNewsReaction.count; break }
                    }
                    return newPost
                }
                return post
            })
            return { ...state, posts: newPosts }
        }
        case EDIT_NEWS_LIKES_AND_DISLIKES: {
            const newPosts: StorePost[] = [...state.posts].map((post: StorePost) => {
                if (post.id === action.editNewsLikesAndDislikes.postId) {
                    let newPost = { ...post }
                    newPost.reaction.likes = action.editNewsLikesAndDislikes.likes;
                    newPost.reaction.dislikes = action.editNewsLikesAndDislikes.dislikes;
                    return newPost
                }
                return post
            })
            return { ...state, posts: newPosts }
        }
        case ADD_NEWS_ONE: {
            let newPosts = [action.addNewsOne, ...state.posts]
            console.log(newPosts)
            return { ...state, posts: newPosts }
        }
        // case EDIT_NEWS_ONE: {

        // }
        case DELETE_NEWS_ONE: {
            let filteredPosts = [...state.posts]
            filteredPosts = filteredPosts.filter((post: StorePost) => {
                return post.id !== action.deleteNewsOne
            })
            return { ...state, posts: [...filteredPosts] }
        }
        case ADD_NEWS_POST_COMMENT: {
            console.log('news reducer: case ADD_NEWS_POST_COMMENT')
            console.log(action)
            let newPosts: [] | StorePost[] = [...state.posts].map((post: StorePost) => {
                if (post.id === action.addNewsPostComment.post.id) {
                    return { ...post, comments: [action.addNewsPostComment.newComment, ...action.addNewsPostComment.post.comments] }
                }
                else {
                    return post
                }
            })
            return { ...state, posts: newPosts }
        }
        case DELETE_NEWS_POST_COMMENT: {
            console.log('newsReducer DELETE_NEWS_POST_COMMENT:', action.deleteNewsPostComment, [...state.posts])
            let newPosts: [] | StorePost[] = [...state.posts].map((post: StorePost) => {
                if (post.id === action.deleteNewsPostComment.postId) {
                    return { ...post, comments: [...post.comments].filter((comment: PostComment) => comment.id !== action.deleteNewsPostComment.commentId) }
                }
                else {
                    return post
                }
            })
            console.log('newsReducer DELETE_NEWS_POST_COMMENT:', newPosts)

            return { ...state, posts: newPosts }
        }
        case EDIT_NEWS_LOADING: return { ...state, loading: !state.loading }
        case EDIT_NEWS_POST_COMMENT_REACTION_LIKES_AND_DISLIKES: {
            let newPosts = [...state.posts].map((post: StorePost) => {

                if (post.id === action.editNewsPostCommentReactionLikesAndDislikes.postId) {

                    let newPost: StorePost = { ...post }
                    newPost.comments.map((userComment: PostComment) => {

                        if (userComment.id === action.editNewsPostCommentReactionLikesAndDislikes.commentId) {
                            let newComment = { ...userComment }
                            newComment.commentReaction.likes = action.editNewsPostCommentReactionLikesAndDislikes.likes;
                            newComment.commentReaction.dislikes = action.editNewsPostCommentReactionLikesAndDislikes.dislikes;
                            // console.log('newsReducer EDIT_NEWS_POST_COMMENT_REACTION_LIKES_AND_DISLIKES newComment:', newComment)
                            return newComment
                        }

                        else {
                            // console.log('newsReducer EDIT_NEWS_POST_COMMENT_REACTION_LIKES_AND_DISLIKES userComment.id:', userComment.id)
                            // console.log('newsReducer EDIT_NEWS_POST_COMMENT_REACTION_LIKES_AND_DISLIKES action.editNewsPostCommentReactionLikesAndDislikes.commentId:', payload)
                            // console.log('newsReducer EDIT_NEWS_POST_COMMENT_REACTION_LIKES_AND_DISLIKES userComment.id(boolean):', userComment.id === payload.commentId)
                            return userComment
                        }

                    })

                    // console.log('newsReducer EDIT_NEWS_POST_COMMENT_REACTION_LIKES_AND_DISLIKES newPost.comments:', newPost.comments)

                    return newPost

                }

                else {
                    return post
                }

            })
            return { ...state, posts: newPosts }
        }
        default: return state
    }
}