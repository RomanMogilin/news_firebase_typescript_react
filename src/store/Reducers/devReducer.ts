import { CHANGE_DEV_MODE } from "../consts"
import { DevAction, DevStore } from "../types"


const InitialDevStore: DevStore = {
    devMode: "development",
}

export const devReducer = (state = InitialDevStore, action: DevAction) => {
    switch (action.type) {
        case CHANGE_DEV_MODE:
            return { ...state, devMode: state.devMode === "development" ? "production" : "development" }
        default:
            return state
    }
}