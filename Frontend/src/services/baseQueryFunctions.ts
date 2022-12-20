import {BaseQueryFn, FetchArgs, fetchBaseQuery, FetchBaseQueryError} from "@reduxjs/toolkit/dist/query/react";
import {STORAGE_ACCESS, STORAGE_REFRESH} from "../store/reducers/authSlice";
import {LoginResponseDataJson} from "../types/response_types/LoginResponseJson";

export const BASE_URL = "http://127.0.0.1:5000";
//export const BASE_URL = "http://localhost:3001";

// TODO: протестировать работу,когда токена нет
const baseQueryWithAuthToken = fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: headers => {
        const current_token = localStorage.getItem(STORAGE_ACCESS);
        if (current_token) {
         //   headers.set('authorization', `Bearer ${current_token}`)
         headers.set('authorization', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6dHJ1ZSwiaWF0IjoxNjcxNTQ5MjA1LCJqdGkiOiI3Yzk0ZWU5MC1jODMwLTQwZjYtOTA2Ny1kNzAyMzI4OTczOTgiLCJ0eXBlIjoiYWNjZXNzIiwic3ViIjoxLCJuYmYiOjE2NzE1NDkyMDUsImV4cCI6MTY3MTU01SIxMH0.1C1zo338LYbBBTWuk2pB1oEle-AW77uLwG-kAA6ug6w`)
        }
        // TODO: а если нету токена?
        return headers;
    }
})

const baseQueryWithRefreshToken = fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: headers => {
        const current_token = localStorage.getItem(STORAGE_REFRESH);
        if (current_token) {
            headers.set('authorization', `Bearer ${current_token}`)
        }
        return headers;
    }
})

export const baseQueryWithReauth: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
    > = async (args, api, extraOptions) => {
    let result = await baseQueryWithAuthToken(args, api, extraOptions)
    console.log("access response:", result);
    if (result.error && result.error.status === 401) {
        if (result.error.data === "{access token invalid}") {
            console.log("GO AWAY: access problem");
        }
        // try to get a new token
        const refreshResult = await baseQueryWithRefreshToken(`/refresh`, api, extraOptions)
        console.log("refresh response: ", refreshResult);
        if (refreshResult.error && refreshResult.error.status === 401) {
            console.log("GO AWAY: refresh problem");
        }
        else if (refreshResult.data) {
            // store the new token
            const data: LoginResponseDataJson = refreshResult.data as LoginResponseDataJson;
            localStorage.setItem(STORAGE_ACCESS, data.access_token);
            localStorage.setItem(STORAGE_REFRESH, data.refresh_token);

            // retry the initial query
            result = await baseQueryWithAuthToken(args, api, extraOptions)
        } else {
            // TODO: не получилось рефрешнуться
            // api.dispath(loggedOut)
        }
    }
    return result
}