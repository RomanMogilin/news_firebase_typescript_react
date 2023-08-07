import { combineReducers, createStore } from "redux";

export interface AuthInitialStore {
    isAuth: boolean
}

interface Action {
    type: string,
    payload?: any,
}

export const CHANGE_AUTH = 'change_auth'

const authInitialStore: AuthInitialStore = {
    isAuth: false
}

const authReducer = (state = authInitialStore, action: Action) => {
    switch (action.type) {
        case CHANGE_AUTH:
            return { ...state, isAuth: !state.isAuth }
        default:
            return state
    }
}

const rootReducer = combineReducers({
    auth: authReducer,
})

export const store = createStore(rootReducer)