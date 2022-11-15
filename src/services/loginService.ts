import {BaseQueryFn, createApi, FetchArgs, FetchBaseQueryError} from "@reduxjs/toolkit/query/react";
import {fetchBaseQuery} from "@reduxjs/toolkit/dist/query/react";
import {UserModel} from "../types/UserModels";
import {BASE_URL} from "./baseQueryFunctions";

export interface LoginRequest {
    email: string,
    password: string
}

export interface LoginRefresh {
    accessToken: string
}

export interface LoginResponse {
    userId: string,
    accessToken: string
}

export const loginAPI = createApi({
    reducerPath: 'loginAPI',
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL
    }),
    endpoints: (build) => ({
        login: build.query<LoginResponse, LoginRequest>({
            query: (loginData) => ({
                url: '/login'
            }),
            extraOptions: {
                maxRetries: 2
            }
        }),
        refresh: build.query<LoginResponse, LoginRefresh>({
            query: (loginData) => ({
                url: '/refresh'
            }),
            extraOptions: {
                maxRetries: 2
            }
        }),
        registration: build.mutation<LoginResponse, LoginRequest>({
            query: (loginData) => ({
                url: '/registration'
            }),
            extraOptions: {
                maxRetries: 2
            }
        }),
    })
})