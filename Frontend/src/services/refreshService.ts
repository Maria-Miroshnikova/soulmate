import {BaseQueryFn, createApi, FetchArgs, FetchBaseQueryError} from "@reduxjs/toolkit/query/react";
import {BASE_URL, baseQueryWithReauth} from "./baseQueryFunctions";

export const refreshAPI = createApi({
    reducerPath: 'refreshAPI',
    baseQuery: baseQueryWithReauth,
    endpoints: (build) => ({
        refresh: build.query<string, void>({
            query: () => ({
                url: '/get_id'
            })
        })
    })
})