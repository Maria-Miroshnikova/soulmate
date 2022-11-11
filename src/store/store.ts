import {combineReducers, configureStore, getDefaultMiddleware} from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import optionsReducer from "./reducers/optionsSlice";
import filterPageFoundUsersReducer from "./reducers/filterPageFoundUsersSlice";
import filterPageFilterReducer from "./reducers/filterPageFilterSlice";
import priorityReducer from "./reducers/prioritySlice";
import userItemPageReducer from "./reducers/userItemsPageSlice";

const rootReducer = combineReducers({
    optionsReducer,
    filterPageFoundUsersReducer,
    filterPageFilterReducer,
    priorityReducer,
    userItemPageReducer
});

export const setupStore = () => {
    return configureStore({
        reducer: rootReducer,
        middleware: [...getDefaultMiddleware(), thunk]
    });
};

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];