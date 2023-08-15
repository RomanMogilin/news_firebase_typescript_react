import { EDIT_AUTH, EDIT_USER_UID } from "../consts"
import { AuthAction, AuthStore } from "../types"

const AuthInitialStore: AuthStore = {
    isAuth: false,
    userUid: '',
}

export const authReducer = (state = AuthInitialStore, action: AuthAction) => {
    switch (action.type) {
        case EDIT_AUTH:
            return { ...state, isAuth: !state.isAuth }
        case EDIT_USER_UID:
            return { ...state, userUid: action.payload }
        default:
            return state
    }
}