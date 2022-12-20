import {BaseQueryFn, createApi, FetchArgs, FetchBaseQueryError} from "@reduxjs/toolkit/query/react";
import {BASE_URL, baseQueryWithReauth} from "./baseQueryFunctions";

export interface RefreshJson {
    user_id: string
}

export const refreshAPI = createApi({
    reducerPath: 'refreshAPI',
    baseQuery: baseQueryWithReauth,
    endpoints: (build) => ({
        refresh: build.query<string, void>({
            query: () => ({
                url: '/get_id'
            }),
            transformResponse: (response: RefreshJson, meta, arg) => {
                return response.user_id;
            }
        })
    })
})