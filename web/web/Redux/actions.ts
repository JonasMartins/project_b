import { GetUserConnectionsQuery } from "generated/graphql";

type AddNote = { type: "ADD_NOTE"; payload: string };
type IsSubmittingPostAction = {
    type: "IS_SUBMITTING_POST";
    payload: boolean;
};

type HasSubmittedPostAction = {
    type: "HAS_SUBMITTED_POST";
    payload: boolean;
};

type HasUpdateUserSettingsAction = {
    type: "HAS_UPDATED_USER_SETTINGS";
    payload: boolean;
};

type GetUserConnections = {
    type: "SET_USER_CONNECTIONS";
    payload: GetUserConnectionsQuery;
};

export type Action =
    | AddNote
    | IsSubmittingPostAction
    | HasSubmittedPostAction
    | HasUpdateUserSettingsAction
    | GetUserConnections;

export const setGetUserConnections = (
    userConnections: GetUserConnectionsQuery
): GetUserConnections => ({
    type: "SET_USER_CONNECTIONS",
    payload: userConnections,
});

export const setHasUpdateUserSettings = (
    hasUpdated: boolean
): HasUpdateUserSettingsAction => ({
    type: "HAS_UPDATED_USER_SETTINGS",
    payload: hasUpdated,
});

export const addNote = (note: string): AddNote => ({
    type: "ADD_NOTE",
    payload: note,
});

export const setIsSubmittingPost = (
    isSubmitting: boolean
): IsSubmittingPostAction => ({
    type: "IS_SUBMITTING_POST",
    payload: isSubmitting,
});

export const setHasSubmittedPost = (
    hasSbmitted: boolean
): HasSubmittedPostAction => ({
    type: "HAS_SUBMITTED_POST",
    payload: hasSbmitted,
});
