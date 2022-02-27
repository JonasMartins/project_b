import { GetUserConnectionsQuery } from "generated/graphql";
import { GlobalTypes } from "Redux/types";
import { postEmotion } from "utils/types/post/post.types";
import { chatsUnseeMessages } from "utils/types/chat/chat.types";

export type IsSubmittingPostAction = {
    type: typeof GlobalTypes.IS_SUBMITTING_POST;
    payload: boolean;
};

export type AddMessageToStore = {
    type: typeof GlobalTypes.ADD_MESSAGE_SENDED_TO_STORE;
    payload: string;
};

export type ClearMessagesFromStore = {
    type: typeof GlobalTypes.CLEAR_MESSAGES_FROM_STORE;
};

export type SetCountUnsawMessagesByChat = {
    type: typeof GlobalTypes.SET_CHATS_COUNT_UNSAW_MESSAGES;
    payload: chatsUnseeMessages;
};

export type CountUnsawMessagesByChat = {
    type: typeof GlobalTypes.CHATS_COUNT_UNSAW_MESSAGES;
    payload: chatsUnseeMessages;
};

export type SetCreatedEmotion = {
    type: typeof GlobalTypes.SET_CREATED_EMOTION;
    payload: postEmotion;
};

export type GetHasCreatedEmotion = {
    type: typeof GlobalTypes.HAS_CREATED_EMOTION;
    payload: boolean;
};

export type CountUserInvitations = {
    type: typeof GlobalTypes.COUNT_USER_INVITATIONS;
    payload: number;
};

export type SetCountUnsawNotifications = {
    type: typeof GlobalTypes.SET_COUNT_UNSAW_NOTIFICATIONS;
    payload: number;
};

export type CountUnsawNotifications = {
    type: typeof GlobalTypes.COUNT_UNSAW_NOTIFICATIONS;
    payload: number;
};
export type CountNewMessages = {
    type: typeof GlobalTypes.COUNT_NEW_MESSAGES;
    payload: number;
};

export type HasSubmittedPostAction = {
    type: typeof GlobalTypes.HAS_SUBMITTED_POST;
    payload: boolean;
};

export type HasUpdateUserSettingsAction = {
    type: typeof GlobalTypes.HAS_UPDATED_USER_SETTINGS;
    payload: boolean;
};

export type GetUserConnections = {
    type: typeof GlobalTypes.SET_USER_CONNECTIONS;
    payload: GetUserConnectionsQuery;
};

export type Action =
    | IsSubmittingPostAction
    | HasSubmittedPostAction
    | HasUpdateUserSettingsAction
    | GetUserConnections
    | CountUserInvitations
    | GetHasCreatedEmotion
    | SetCreatedEmotion
    | CountNewMessages
    | SetCountUnsawMessagesByChat
    | AddMessageToStore
    | ClearMessagesFromStore
    | CountUnsawNotifications
    | SetCountUnsawNotifications;

export * as actionCreators from "Redux/actionCreators";
