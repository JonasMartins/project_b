import { GetUserConnectionsQuery } from "generated/graphql";
import { GlobalTypes } from "Redux/types";
import { Action } from "Redux/actions";
import { Dispatch } from "redux";

export const setGetUserConnections = (
    userConnections: GetUserConnectionsQuery
) => {
    return (dispatch: Dispatch<Action>) => {
        dispatch({
            type: GlobalTypes.SET_USER_CONNECTIONS,
            payload: userConnections,
        });
    };
};

export const setCountUserInvitations = (count: number) => {
    return (dispatch: Dispatch<Action>) => {
        dispatch({
            type: GlobalTypes.COUNT_USER_INVITATIONS,
            payload: count,
        });
    };
};

export const setHasUpdateUserSettings = (hasUpdated: boolean) => {
    return (dispatch: Dispatch<Action>) => {
        dispatch({
            type: GlobalTypes.HAS_UPDATED_USER_SETTINGS,
            payload: hasUpdated,
        });
    };
};

export const setIsSubmittingPost = (isSubmitting: boolean) => {
    return (dispatch: Dispatch<Action>) => {
        dispatch({
            type: GlobalTypes.IS_SUBMITTING_POST,
            payload: isSubmitting,
        });
    };
};

export const setHasSubmittedPost = (hasSbmitted: boolean) => {
    return (dispatch: Dispatch<Action>) => {
        dispatch({
            type: GlobalTypes.HAS_SUBMITTED_POST,
            payload: hasSbmitted,
        });
    };
};
