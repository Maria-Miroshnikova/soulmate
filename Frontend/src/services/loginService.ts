import {BaseQueryFn, createApi, FetchArgs, FetchBaseQueryError} from "@reduxjs/toolkit/query/react";
import {fetchBaseQuery} from "@reduxjs/toolkit/dist/query/react";
import {UserModel, UserPersonalInfoModel} from "../types/UserModels";
import {BASE_URL} from "./baseQueryFunctions";
import {
    LoginResponseDataJson
} from "../types/response_types/LoginResponseJson";
import {UserPersonsResponseJson} from "../types/response_types/UserPersonsResponseJson";
import {UserInfoRequestJson} from "../types/response_types/userInfoJson";

export interface LoginRequest {
    nickname: string,
    password: string
}

// TODO: сделать более подробную регистрацию? в любом случае надо будет дозаполнять после регистрации поля...
export interface RegistrationRequest {
    nickname: string,
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
       /* login: build.mutation<LoginResponse, LoginRequest>({
            query: (loginData) => ({
                url: '/login',
                body: loginData,
                method: 'POST'
            }),
            extraOptions: {
                maxRetries: 2
            }
        }),*/
       /* refresh: build.mutation<LoginResponse, LoginRefresh>({
            query: (loginRefresh) => ({
                url: '/refresh',
                body: loginRefresh,
                method: 'POST'
            }),
            extraOptions: {
                maxRetries: 2
            }
        }),
        registration: build.mutation<LoginResponse, LoginRequest>({
            query: (loginData) => ({
                url: '/registration',
                body: loginData,
                method: 'POST'
            }),
            extraOptions: {
                maxRetries: 2
            }
        }),*/
        login: build.query<LoginResponseDataJson, string>({
            query: (arg) => ({
                url: '/login',
                params: {
                    token: arg
                }
            })
        })
    })
})