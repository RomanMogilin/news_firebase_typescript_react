import { ADD_USER_POST, ADD_USER_REACTION, DELETE_USER_POST, DELETE_USER_REACTION, EDIT_USER_DATE_OF_REGISTRATON, EDIT_USER_NAME, EDIT_USER_REACTION } from "../consts"
import { UserReaction, UserStore, userAction } from "../types"

const UserInitialStore: UserStore = {
    dateOfRegistration: '',
    posts: [],
    userName: '',
    reaction: []
}

/**
 * @caseEDIT_USER_NAME как payload принимает строку
 * @caseEDIT_DATE_OF_REGISTRATON как payload принимает строку
 * @caseADD_POST как payload принимает StorePost
 * @caseDELETE_POST как payload принимает строку
 */
export const userReducer = (state = UserInitialStore, action: userAction) => {
    switch (action.type) {
        case EDIT_USER_NAME: return { ...state, userName: action.editUserName }
        case EDIT_USER_DATE_OF_REGISTRATON: return { ...state, dateOfRegistration: action.editUserDateOfRegistration }
        case ADD_USER_POST: {
            let copy_of_posts = [...state.posts]
            return { ...state, posts: [...copy_of_posts, action.addUserPost] }
        }
        case DELETE_USER_POST: {
            let filteredPosts = [...state.posts]
            filteredPosts = filteredPosts.filter((post) => {
                return post.id !== action.deleteUserPost
            })
            return { ...state, posts: [...filteredPosts] }
        }
        case ADD_USER_REACTION: {
            //console.log('reducer: user; case: ADD_USER_REACTION', action.addUserReaction);
            let newReaction: UserReaction = { postId: action.addUserReaction.postId, reaction: action.addUserReaction.reaction };
            //console.log('reducer: user; case: ADD_USER_REACTION commentId:', action.addUserReaction.commentId, !!action.addUserReaction.commentId)
            if (action.addUserReaction.commentId) { newReaction.commentId = action.addUserReaction.commentId };
            //console.log('reducer: user; case: ADD_USER_REACTION newReaction:', newReaction)
            let newReactions = [...state.reaction, newReaction]
            return { ...state, reaction: [...newReactions] }
        }
        case EDIT_USER_REACTION: {
            // console.log('reducer: user; case: EDIT_USER_REACTION', action.editUserReaction);
            let newReaction: UserReaction = { postId: action.editUserReaction.postId, reaction: action.editUserReaction.reaction };
            let isCommentIdDefined = action.editUserReaction.commentId ? true : false;
            // console.log('reducer: user; case: EDIT_USER_REACTION===newReaction:', newReaction, `isCommentIdDefined:`, isCommentIdDefined);
            if (isCommentIdDefined) { newReaction.commentId = action.editUserReaction.commentId };
            let newReactions = [...state.reaction].map((reaction: UserReaction) => {
                if ((isCommentIdDefined === true) && ((action.editUserReaction.postId === reaction.postId) && (action.editUserReaction.commentId === reaction.commentId))) {
                    let newReaction = { ...reaction }
                    newReaction.reaction = action.editUserReaction.reaction;
                    return newReaction;
                }
                else if ((isCommentIdDefined === false) && (action.editUserReaction.postId === reaction.postId)) {
                    let newReaction = { ...reaction }
                    newReaction.reaction = action.editUserReaction.reaction;
                    return newReaction;
                }
                else {
                    return reaction
                }
            })
            return { ...state, reaction: [...newReactions] }
        }
        case DELETE_USER_REACTION: {
            let newReaction = [...state.reaction].filter((reaction: UserReaction) => {
                let isCommentIdDefined = !!action.deleteUserReaction.commentId

                // console.log('reducer: user; case: DELETE_USER_REACTION', action.deleteUserReaction, isCommentIdDefined, action.deleteUserReaction.commentId);
                if (isCommentIdDefined === true) {
                    return (reaction.postId !== action.deleteUserReaction.postId) || (reaction.commentId !== action.deleteUserReaction.commentId)
                }
                else {
                    return reaction.postId !== action.deleteUserReaction.postId
                }
            })
            return { ...state, reaction: [...newReaction] }
        }
        default: return state
    }
}