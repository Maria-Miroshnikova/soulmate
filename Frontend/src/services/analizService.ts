import {createApi} from "@reduxjs/toolkit/query/react";
import {baseQueryWithReauth} from "./baseQueryFunctions";
import {UserCardInfo} from "../types/UserCardInfo";
import {ItemModel} from "../types/ItemModel";
import {Categories} from "../types/Categories";
import { categoryParamByCategories } from "./userdataService";
import {SharedItemJson, SharedItemsResponseJson} from "../types/response_types/SharedItemsResponseJson";
import {ItemJson} from "../types/response_types/userItemsRequestJson";
import {DifferentRatingJson, DifferentRatingResponseJson} from "../types/response_types/DifferentRatingResponseJson";
import {TopItemJson, TopItemsResponseJson} from "../types/response_types/TopItemsResponseJson";

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
    userTop: ItemModel[]
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
                params: {
                    userId: arg.userId,
                    category: categoryParamByCategories(arg.category),
                    isMain: (arg.isMain) ? 'true' : 'false',
                    personId: arg.personId
                }
            }),
            transformResponse: (response: SharedItemsResponseJson, meta, arg): ItemModel[] => {
                const result: ItemModel[] = [];
                for (var i = 0; i < response.Items.length; ++i) {
                    const item: SharedItemJson = response.Items[i];
                    result.push({
                        id: item.id,
                        title: item.title,
                        rating: 0
                    })
                }
                return result;
            }
        }),
        // transform для РЭЙТИНГА который не передается
        fetchNewData: build.query<ItemModel[], SharedDataRequest>({
            query: (arg) => ({
                url: '/new',
                params: {
                    userId: arg.userId,
                    category: categoryParamByCategories(arg.category),
                    isMain: (arg.isMain) ? 'true' : 'false',
                    personId: arg.personId
                }
            }),
            transformResponse: (response: SharedItemsResponseJson, meta, arg): ItemModel[] => {
                const result: ItemModel[] = [];
                for (var i = 0; i < response.Items.length; ++i) {
                    const item: SharedItemJson = response.Items[i];
                    result.push({
                        id: item.id,
                        title: item.title,
                        rating: 0
                    })
                }
                return result;
            }
        }),
        // transform для типов
        fetchTopData:  build.query<TopDataResponse, TopDataRequest>({
            query: (arg) => ({
                url: '/top',
                params: {
                    userId: arg.userId,
                    category: categoryParamByCategories(arg.category),
                    isMain: (arg.isMain) ? 'true' : 'false',
                    isHigh: (arg.isHigh) ? 'true' : 'false'
                }
            }),
            transformResponse: (response: TopItemsResponseJson, meta, arg): TopDataResponse => {
                const result: ItemModel[] = [];
                for (var i = 0; i < response.Items.length; ++i) {
                    const item: TopItemJson = response.Items[i];
                    result.push({
                        id: item.id,
                        title: item.title,
                        rating: item.rating
                    })
                }
                return {
                    userTop: result
                };
            }
        }),
        // transform для всего
        fetchDifferentRatingData:  build.query<DifferentRatingResponse, SharedDataRequest>({
            query: (arg) => ({
                url: '/different',
                params: {
                    userId: arg.userId,
                    category: categoryParamByCategories(arg.category),
                    isMain: (arg.isMain) ? 'true' : 'false',
                    personId: arg.personId
                }
            }),
            transformResponse: (response: DifferentRatingResponseJson, meta, arg): DifferentRatingResponse => {
                const result: ItemModel[] = [];
                const person_ratings: number[] = [];
                for (var i = 0; i < response.Items.length; ++i) {
                    const item: DifferentRatingJson = response.Items[i];
                    result.push({
                        id: item.id,
                        title: item.title,
                        rating: item.rating_user
                    });
                    person_ratings.push(item.rating_person);
                }
                return {
                    userItems: result,
                    personRatings: person_ratings
                };
            }
        })
    })
})