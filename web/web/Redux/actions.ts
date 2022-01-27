import { GetUserConnectionsQuery } from "generated/graphql";
import { GlobalTypes } from "Redux/types";

export type IsSubmittingPostAction = {
    type: typeof GlobalTypes.IS_SUBMITTING_POST;
    payload: boolean;
};

export type CountUserInvitations = {
    type: typeof GlobalTypes.COUNT_USER_INVITATIONS;
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
    | CountUserInvitations;

export * as actionCreators from "Redux/actionCreators";
