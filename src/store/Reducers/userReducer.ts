import { ADD_USER_POST, ADD_USER_REACTION, DELETE_USER_ONLY_POST_REACTION, DELETE_USER_POST, DELETE_USER_REACTION, EDIT_USER_DATE_OF_REGISTRATON, EDIT_USER_DESCRIPTION, EDIT_USER_NAME, EDIT_USER_PROFILE_PHOTO, EDIT_USER_REACTION } from "../consts"
import { StorePost, UserReaction, UserStore, userAction } from "../types"

const UserInitialStore: UserStore = {
    dateOfRegistration: '',
    posts: [],
    userName: '',
    reaction: [],
    profilePhoto: '',
    description: ''
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
        case EDIT_USER_PROFILE_PHOTO: return { ...state, profilePhoto: action.editUserProfilePhoto }
        case EDIT_USER_DESCRIPTION: return { ...state, description: action.editUserDescription }
        case EDIT_USER_DATE_OF_REGISTRATON: return { ...state, dateOfRegistration: action.editUserDateOfRegistration }
        case ADD_USER_POST: {
            let copy_of_posts: StorePost[] = [...state.posts]
            return { ...state, posts: [action.addUserPost, ...copy_of_posts] }
        }
        case DELETE_USER_POST: {
            let filteredPosts: StorePost[] = [...state.posts]
            filteredPosts = filteredPosts.filter((post: StorePost) => {
                return post.id !== action.deleteUserPost
            })
            return { ...state, posts: [...filteredPosts] }
        }
        case ADD_USER_REACTION: {
            let newReaction: UserReaction = { postId: action.addUserReaction.postId, reaction: action.addUserReaction.reaction, postHeader: action.addUserReaction.postHeader };
            const isCommentIdDefined: boolean = action.addUserReaction.commentId !== undefined;
            if (isCommentIdDefined) {
                newReaction.commentId = action.addUserReaction.commentId;
                newReaction.commentHeader = action.addUserReaction.commentHeader;
            };
            let newReactions: UserReaction[] = [newReaction, ...state.reaction]
            return { ...state, reaction: [...newReactions] }
        }
        case EDIT_USER_REACTION: {
            let newReaction: UserReaction = { postId: action.editUserReaction.postId, reaction: action.editUserReaction.reaction, postHeader: action.editUserReaction.postHeader };
            let isCommentIdDefined: boolean = action.editUserReaction.commentId !== undefined;
            if (isCommentIdDefined) {
                newReaction.commentId = action.editUserReaction.commentId;
                newReaction.commentHeader = action.editUserReaction.commentHeader;
            };
            let newReactions = [...state.reaction].map((reaction: UserReaction) => {
                if ((isCommentIdDefined === true) && ((action.editUserReaction.postId === reaction.postId) && (action.editUserReaction.commentId === reaction.commentId))) {
                    let newReaction: UserReaction = { ...reaction }
                    newReaction.reaction = action.editUserReaction.reaction;
                    return newReaction;
                }
                else if ((isCommentIdDefined === false) && (action.editUserReaction.postId === reaction.postId)) {
                    let newReaction: UserReaction = { ...reaction }
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
                let isCommentIdDefined: boolean = action.deleteUserReaction.commentId !== undefined;
                // console.log('reaction:', reaction, ', isCommentIdentifed:', isCommentIdDefined)

                // console.log('reducer: user; case: DELETE_USER_REACTION/ACTION', action.deleteUserReaction, isCommentIdDefined, action.deleteUserReaction.commentId);
                if (isCommentIdDefined === true) {
                    return (reaction.postId !== action.deleteUserReaction.postId) || (reaction.commentId !== action.deleteUserReaction.commentId)
                }
                else {
                    // console.log('reducer: user; case: DELETE_USER_REACTION/commentId=false:', reaction, 'isCommentIdDefined:', isCommentIdDefined, reaction.commentId)
                    return (reaction.postId !== action.deleteUserReaction.postId)
                }
            })
            return { ...state, reaction: [...newReaction] }
        }
        case DELETE_USER_ONLY_POST_REACTION: {
            console.log('DELETE_USER_ONLY_POST_REACTION')
            let newReaction = [...state.reaction].filter((reaction: UserReaction) => {
                // let constTrue = true
                // console.log('reaction:', reaction)

                // console.log('reducer: user; case: DELETE_USER_ONLY_POST_REACTION/ACTION', action.deleteUserOnlyPostReaction);

                // console.log('reducer: user; case: DELETE_USER_ONLY_POST_REACTION/commentId=false:', reaction, 'isCommentIdDefined:', reaction.commentId)

                // console.log('isDelete:', reaction.commentId === undefined && reaction.postId === action.deleteUserOnlyPostReaction)

                return !((reaction.commentId === undefined) && (reaction.postId === action.deleteUserOnlyPostReaction))

            })
            console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$4')
            return { ...state, reaction: [...newReaction] }
        }
        default: return state
    }
}