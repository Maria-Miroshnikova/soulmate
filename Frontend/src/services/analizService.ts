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

// топ одного пользователя
export interface TopDataRequest {
    userId: string,
    category: Categories,
    isMain: boolean,
    isHigh: boolean
}

// TODO: после тестов убрать personTop
export interface TopDataResponse {
    userTop: ItemModel[],
    personTop: ItemModel[]
}

export interface DifferentRatingResponse {
    userItems: ItemModel[],
    personRatings: number[]
}

export const analizAPI = createApi({
    reducerPath: 'analizAPI',
    baseQuery: baseQueryWithReauth,
    endpoints: (build) => ({
        // сразу по двум?
        // transform для РЭЙТИНГА который не передается
        fetchCommonData: build.query<ItemModel[], SharedDataRequest>({
            query: (arg) => ({
                url: '/common',
            })
        }),
        // transform для РЭЙТИНГА который не передается
        fetchNewData: build.query<ItemModel[], SharedDataRequest>({
            query: (arg) => ({
                url: '/new',
            })
        }),
        // transform для типов
        fetchTopData:  build.query<TopDataResponse, TopDataRequest>({
            query: (arg) => ({
                url: '/top',
            })
        }),
        // transform для всего
        fetchDifferentRatingData:  build.query<DifferentRatingResponse, SharedDataRequest>({
            query: (arg) => ({
                url: '/different',
            })
        })
    })
})