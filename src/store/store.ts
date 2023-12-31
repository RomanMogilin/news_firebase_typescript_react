import { combineReducers, createStore } from "redux";
import { authReducer } from "./Reducers/authReducer";
import { userReducer } from "./Reducers/userReducer";
import { newsReducer } from "./Reducers/newsReducer";
import { composeWithDevTools } from "redux-devtools-extension";
import { devReducer } from "./Reducers/devReducer";

const rootReducer = combineReducers({
    auth: authReducer,
    user: userReducer,
    news: newsReducer,
    dev: devReducer
})

/**
 * @description Redux Store
 */
export const store = createStore(rootReducer, composeWithDevTools())