import { Action } from "Redux/actions";
import { GetUserConnectionsQuery } from "generated/graphql";
import { GlobalTypes } from "Redux/types";
import { combineReducers } from "redux";
import { postEmotion } from "utils/types/post/post.types";

export interface globalState {
    isSubmittinPost: boolean;
    hasSubmittedPost: boolean;
    hasUpdateUserSettings: boolean;
    userConnections: GetUserConnectionsQuery | null;
    countUserInvitations: number;
    hasCreatedEmotion: boolean;
    createdEmotion: postEmotion | null;
}
const initialState = {
    isSubmittinPost: false,
    hasSubmittedPost: false,
    hasUpdateUserSettings: false,
    userConnections: null,
    countUserInvitations: 0,
    hasCreatedEmotion: false,
    createdEmotion: null,
};
export const globalReducer = (
    state: globalState = initialState,
    action: Action
) => {
    switch (action.type) {
        case GlobalTypes.IS_SUBMITTING_POST: {
            return { ...state, isSubmittinPost: action.payload };
        }
        case GlobalTypes.HAS_SUBMITTED_POST: {
            return { ...state, hasSubmittedPost: action.payload };
        }
        case GlobalTypes.HAS_UPDATED_USER_SETTINGS: {
            return { ...state, hasUpdateUserSettings: action.payload };
        }
        case GlobalTypes.SET_USER_CONNECTIONS: {
            return { ...state, userConnections: action.payload };
        }
        case GlobalTypes.COUNT_USER_INVITATIONS: {
            return { ...state, countUserInvitations: action.payload };
        }
        case GlobalTypes.HAS_CREATED_EMOTION: {
            return { ...state, hasCreatedEmotion: action.payload };
        }
        case GlobalTypes.SET_CREATED_EMOTION: {
            return { ...state, createdEmotion: action.payload };
        }
        default:
            return state;
    }
};

export const reducers = combineReducers({
    globalReducer,
});

export type RootState = ReturnType<typeof reducers>;
