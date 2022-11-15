import {combineReducers, configureStore, getDefaultMiddleware} from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import optionsReducer from "./reducers/optionsSlice";
import filterPageFoundUsersReducer from "./reducers/filterPageFoundUsersSlice";
import filterPageFilterReducer from "./reducers/filterPageFilterSlice";
import priorityReducer from "./reducers/prioritySlice";
import userItemPageReducer from "./reducers/userItemsPageSlice";
import {filterAPI} from "../services/filterUsercardsService";
import {setupListeners} from "@reduxjs/toolkit/query";
import authReducer from "./reducers/authSlice";
import {loginAPI} from "../services/loginService";

const rootReducer = combineReducers({
    optionsReducer,
    filterPageFoundUsersReducer,
    filterPageFilterReducer,
    priorityReducer,
    userItemPageReducer,
    authReducer,
    [filterAPI.reducerPath]: filterAPI.reducer,
    [loginAPI.reducerPath]: loginAPI.reducer
});

export const setupStore = () => {
    return configureStore({
        reducer: rootReducer,
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware().concat(filterAPI.middleware).concat(thunk).concat(loginAPI.middleware)
    });
};

export const STORE = setupStore();
setupListeners(STORE.dispatch);

export type RootState = ReturnType<typeof STORE.getState>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = typeof STORE.dispatch;