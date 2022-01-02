import { Action } from "Redux/actions";

export interface globalState {
    notes: string[];
    isSubmittinPost: boolean;
    hasSubmittedPost: boolean;
}
const initialState = {
    notes: [],
    isSubmittinPost: false,
    hasSubmittedPost: false,
};

export const globalReducer = (
    state: globalState = initialState,
    action: Action
) => {
    switch (action.type) {
        case "ADD_NOTE": {
            return { ...state, notes: [...state.notes, action.payload] };
        }
        case "IS_SUBMITTING_POST": {
            return { ...state, isSubmittinPost: action.payload };
        }
        case "HAS_SUBMITTED_POST": {
            return { ...state, hasSubmittedPost: action.payload };
        }
        default:
            return state;
    }
};
