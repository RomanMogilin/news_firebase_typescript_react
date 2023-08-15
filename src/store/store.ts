import { combineReducers, createStore } from "redux";
import { authReducer } from "./Reducers/authReducer";
import { userReducer } from "./Reducers/userReducer";

const rootReducer = combineReducers({
    auth: authReducer,
    user: userReducer,
})

/**
 * @description Redux Store
 */
export const store = createStore(rootReducer)