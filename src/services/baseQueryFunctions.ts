import {BaseQueryFn, FetchArgs, fetchBaseQuery, FetchBaseQueryError} from "@reduxjs/toolkit/dist/query/react";

export const BASE_URL = "http://localhost:3001";

// TODO: протестировать работу,когда токена нет
const baseQueryWithAuthToken = fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: headers => {
        const current_token = localStorage.getItem('accessToken');
        if (current_token) {
            headers.set('authorization', `Bearer ${current_token}`)
        }
        // TODO: а если нету токена?
    }
})

export const baseQueryWithReauth: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
    > = async (args, api, extraOptions) => {
    let result = await baseQueryWithAuthToken(args, api, extraOptions)
    if (result.error && result.error.status === 401) {
        // try to get a new token
        const refreshResult = await baseQueryWithAuthToken('/refresh', api, extraOptions)
        if (refreshResult.data) {
            // store the new token
            localStorage.setItem('accessToken', refreshResult.data as string)
            // retry the initial query
            result = await baseQueryWithAuthToken(args, api, extraOptions)
        } else {
            // TODO: не получилось рефрешнуться
            // api.dispath(loggedOut)
        }
    }
    return result
}