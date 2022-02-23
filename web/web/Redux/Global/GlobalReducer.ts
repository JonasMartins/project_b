import { Action } from "Redux/actions";
import { GetUserConnectionsQuery } from "generated/graphql";
import { GlobalTypes } from "Redux/types";
import { combineReducers } from "redux";
import { postEmotion } from "utils/types/post/post.types";
import { chatsUnseeMessages } from "utils/types/chat/chat.types";

export interface globalState {
    isSubmittinPost: boolean;
    hasSubmittedPost: boolean;
    hasUpdateUserSettings: boolean;
    userConnections: GetUserConnectionsQuery | null;
    countUserInvitations: number;
    countUserNewMessages: number;
    hasCreatedEmotion: boolean;
    createdEmotion: postEmotion | null;
    chatsCountUnsawMessages: chatsUnseeMessages | null;
    messagesSended: string[];
}
const initialState = {
    isSubmittinPost: false,
    hasSubmittedPost: false,
    hasUpdateUserSettings: false,
    userConnections: null,
    countUserInvitations: 0,
    countUserNewMessages: 0,
    hasCreatedEmotion: false,
    createdEmotion: null,
    chatsCountUnsawMessages: null,
    messagesSended: [],
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
        case GlobalTypes.COUNT_NEW_MESSAGES: {
            return { ...state, countUserNewMessages: action.payload };
        }
        case GlobalTypes.SET_CHATS_COUNT_UNSAW_MESSAGES: {
            return { ...state, chatsCountUnsawMessages: action.payload };
        }
        case GlobalTypes.ADD_MESSAGE_SENDED_TO_STORE: {
            return {
                ...state,
                messagesSended: [action.payload, ...state.messagesSended],
            };
        }
        case GlobalTypes.CLEAR_MESSAGES_FROM_STORE: {
            return {
                ...state,
                messagesSended: [],
            };
        }
        default:
            return state;
    }
};

export const reducers = combineReducers({
    globalReducer,
});

export type RootState = ReturnType<typeof reducers>;
