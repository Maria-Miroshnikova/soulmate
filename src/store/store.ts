import {combineReducers, configureStore, getDefaultMiddleware} from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import optionsReducer from "./reducers/optionsSlice";
import filterPageFoundUsersReducer from "./reducers/filterPageFoundUsersSlice";
import filterPageFilterReducer from "./reducers/filterPageFilterSlice";
import priorityReducer from "./reducers/prioritySlice";
import searchConentReducer from "./reducers/searchContentSlice";
import {filterAPI} from "../services/filterService";
import {setupListeners} from "@reduxjs/toolkit/query";
import authReducer from "./reducers/authSlice";
import {loginAPI} from "../services/loginService";
import {userdataAPI} from "../services/userdataService";
import {analizAPI} from "../services/analizService";

const rootReducer = combineReducers({
    optionsReducer,
    [analizAPI.reducerPath]: analizAPI.reducer,
    filterPageFoundUsersReducer,
    filterPageFilterReducer,
    priorityReducer,
    searchConentReducer,
    authReducer,
    [filterAPI.reducerPath]: filterAPI.reducer,
    [loginAPI.reducerPath]: loginAPI.reducer,
    [userdataAPI.reducerPath]: userdataAPI.reducer,
});

export const setupStore = () => {
    return configureStore({
        reducer: rootReducer,
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware().concat(filterAPI.middleware, thunk, loginAPI.middleware, userdataAPI.middleware, analizAPI.middleware)
    });
};

export const STORE = setupStore();
setupListeners(STORE.dispatch);

export type RootState = ReturnType<typeof STORE.getState>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = typeof STORE.dispatch;