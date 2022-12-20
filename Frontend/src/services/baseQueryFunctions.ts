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
            headers.set('authorization', `Bearer ${current_token}`)
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
            return result;
        }
        // try to get a new token
        const refreshResult = await baseQueryWithRefreshToken(`/refresh`, api, extraOptions)
        console.log("refresh response: ", refreshResult);
        if (refreshResult.error && refreshResult.error.status === 401) {
            console.log("GO AWAY: refresh problem");
            return refreshResult;
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