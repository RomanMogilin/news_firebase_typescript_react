export interface Action {
    type: string,
    payload?: any,
}

export interface AuthAction extends Action {
    payload?: string
}

/**
 * @description Type для state **`authReducer`**
 */
export interface AuthStore {
    isAuth: boolean,
    userUid: string
}

/**
 * @description Type для state в useSelector
 */
export interface GlobalStore {
    auth: AuthStore
}