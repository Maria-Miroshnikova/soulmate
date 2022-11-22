import {createApi} from "@reduxjs/toolkit/query/react";
import {baseQueryWithReauth} from "./baseQueryFunctions";
import {UserCardInfo} from "../types/UserCardInfo";

export const analizAPI = createApi({
    reducerPath: 'filterAPI',
    baseQuery: baseQueryWithReauth,
    endpoints: (build) => ({
        // ТЕСТОВЫЙ
        fetchUserCardsAll: build.query<UserCardInfo[], void>({
            query: () => ({
                url: '/userfilter',
            })
        }), //
    })
})