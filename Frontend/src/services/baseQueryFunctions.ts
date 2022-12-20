import {BaseQueryFn, FetchArgs, fetchBaseQuery, FetchBaseQueryError} from "@reduxjs/toolkit/dist/query/react";
import {STORAGE_ACCESS, STORAGE_REFRESH} from "../store/reducers/authSlice";

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
    console.log("ARGS ", args);
    let result = await baseQueryWithAuthToken(args, api, extraOptions)
    console.log("acess error:", result);
    if (result.error && result.error.status === 401) {
        // try to get a new token
        const refreshResult = await baseQueryWithRefreshToken(`/refresh`, api, extraOptions)
        console.log("refreshResult: ", refreshResult);
        if (refreshResult.data) {
            // store the new token

            console.log("refreshResult: ", refreshResult);

          //  localStorage.setItem(STORAGE_ACCESS, refreshResult.data as string);
          //  localStorage.setItem(STORAGE_REFRESH, refreshResult.data as string);

            // retry the initial query
            result = await baseQueryWithAuthToken(args, api, extraOptions)
        } else {
            // TODO: не получилось рефрешнуться
            // api.dispath(loggedOut)
        }
    }
    return result
}