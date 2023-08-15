import { ADD_POST, DELETE_POST, EDIT_DATE_OF_REGISTRATON, EDIT_USER_NAME } from "../consts"
import { UserStore, userAction } from "../types"

const UserInitialStore: UserStore = {
    dateOfRegistration: '',
    posts: [],
    userName: ''
}

/**
 * @caseEDIT_USER_NAME как payload принимает строку
 * @caseEDIT_DATE_OF_REGISTRATON как payload принимает строку
 * @caseADD_POST как payload принимает StorePost
 * @caseDELETE_POST как payload принимает строку
 */
export const userReducer = (state = UserInitialStore, action: userAction) => {
    switch (action.type) {
        case EDIT_USER_NAME: return { ...state, userName: action.payload }
        case EDIT_DATE_OF_REGISTRATON: return { ...state, dateOfRegistration: action.payload }
        case ADD_POST: {
            let copy_of_posts = [...state.posts]
            return { ...state, posts: [...copy_of_posts, action.payload] }
        }
        case DELETE_POST: {
            let filteredPosts = [...state.posts]
            filteredPosts = filteredPosts.filter((post) => {
                return post.id !== action.payload
            })
            return { ...state, posts: [...filteredPosts] }
        }
        default: return state
    }
}