import { EDIT_NEWS_REACTION, EDIT_NEWS, EDIT_NEWS_LIKES_AND_DISLIKES } from "../consts"
import { NewsStore, StorePost, newsAction } from "../types"

const newsInitialStore: NewsStore = {
    posts: []
}

export const newsReducer = (state = newsInitialStore, action: newsAction) => {
    switch (action.type) {
        case EDIT_NEWS: return { ...state, posts: action.payload.editNews }
        case EDIT_NEWS_REACTION: {
            const newPosts: StorePost[] = [...state.posts].map((post: StorePost) => {
                if (post.id === action.payload.editNewsReaction.postId) {
                    let newPost = { ...post }
                    // console.log('find the post in Reducer')
                    // console.log(action)
                    // console.log(action.payload.editNewsReaction)
                    switch (action.payload.editNewsReaction.ReactionType) {
                        case 'view': { newPost.reaction.views = action.payload.editNewsReaction.count; console.log('Reducer views'); break }
                        case 'like': { newPost.reaction.likes = action.payload.editNewsReaction.count; break }
                        case 'dislike': { newPost.reaction.dislikes = action.payload.editNewsReaction.count; break }
                    }
                    return newPost
                }
                return post
            })
            return { ...state, posts: newPosts }
        }
        case EDIT_NEWS_LIKES_AND_DISLIKES: {
            const newPosts: StorePost[] = [...state.posts].map((post: StorePost) => {
                if (post.id === action.payload.editNewsLikesAndDislikes.postId) {
                    let newPost = { ...post }
                    newPost.reaction.likes = action.payload.editNewsLikesAndDislikes.likes;
                    newPost.reaction.dislikes = action.payload.editNewsLikesAndDislikes.dislikes;
                    return newPost
                }
                return post
            })
            return { ...state, posts: newPosts }
        }
        default: return state
    }
}