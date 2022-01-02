import { createStore } from "redux";
import { globalReducer } from "Redux/Global/GlobalReducer";

export const store = createStore(globalReducer);
