import { combineReducers, createStore } from "redux";
import { CHANGE_AUTH, SET_USER_UID } from "./consts";
import { AuthAction, AuthStore } from "./types";

const authInitialStore: AuthStore = {
    isAuth: false,
    userUid: '',
}

const authReducer = (state = authInitialStore, action: AuthAction) => {
    switch (action.type) {
        case CHANGE_AUTH:
            return { ...state, isAuth: !state.isAuth }
        case SET_USER_UID:
            return { ...state, userUid: action.payload }
        default:
            return state
    }
}

const rootReducer = combineReducers({
    auth: authReducer,
})

/**
 * @description Redux Store
 */
export const store = createStore(rootReducer)