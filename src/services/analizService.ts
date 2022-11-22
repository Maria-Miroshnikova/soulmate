import {createApi} from "@reduxjs/toolkit/query/react";
import {baseQueryWithReauth} from "./baseQueryFunctions";
import {UserCardInfo} from "../types/UserCardInfo";
import {ItemModel} from "../types/ItemModel";
import {Categories} from "../types/Categories";

export interface SharedDataRequest {
    userId: string,
    personId: string,
    category: Categories,
    isMain: boolean
}

export interface TopDataRequest {
    userId: string,
    personId: string,
    category: Categories,
    isMain: boolean,
    isHigh: boolean
}

export interface TopDataResponse {
    userTop: ItemModel[],
    personTop: ItemModel[]
}

export interface DifferentRatingResponse {
    userItems: ItemModel[],
    personRatings: number[]
}

export const analizAPI = createApi({
    reducerPath: 'filterAPI',
    baseQuery: baseQueryWithReauth,
    endpoints: (build) => ({
        fetchCommonData: build.query<ItemModel[], SharedDataRequest>({
            query: (ard) => ({
                url: '/common',
            })
        }),
        fetchNewData: build.query<ItemModel[], SharedDataRequest>({
            query: (ard) => ({
                url: '/new',
            })
        }),
        fetchTopData:  build.query<TopDataResponse, TopDataRequest>({
            query: (ard) => ({
                url: '/top',
            })
        }),
        fetchDifferentRatingData:  build.query<DifferentRatingResponse, SharedDataRequest>({
            query: (ard) => ({
                url: '/different',
            })
        })
    })
})