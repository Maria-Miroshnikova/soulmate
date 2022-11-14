import {createApi} from "@reduxjs/toolkit/query/react";
import {fetchBaseQuery} from "@reduxjs/toolkit/dist/query/react";
import {BASE_URL} from "./filterUsercardsService";
import {UserModel} from "../types/UserModels";

export interface LoginData {
    email: string,
    password: string
}

export const loginAPI = createApi({
    reducerPath: 'loginAPI',
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL
    }),
    endpoints: (build) => ({
        login: build.query<UserModel, LoginData>({
            query: (loginData) => ({
                url: '/login'
            })
        }),
        refresh: build.query<UserModel, string>({
            query: (accessToken) => ({
                url: '/refresh'
            })
        }),
        registration: build.mutation<void, LoginData>({
            query: (loginData) => ({
                url: '/registration'
            })
        }),
    })
})