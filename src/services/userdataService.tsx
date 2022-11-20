import {createApi} from "@reduxjs/toolkit/query/react";
import {baseQueryWithReauth} from "./baseQueryFunctions";
import {UserCardInfo} from "../types/UserCardInfo";
import {UserModel} from "../types/UserModels";
import {ItemModel} from "../types/ItemModel";
import {Categories} from "../types/Categories";

export interface UserByIdRequest {
    userId: string
}

export interface ItemByIdRequest {
    userId: string,
    category: Categories,
    isMain: boolean,
    title?: string
}

export interface UpdateItemRequest {
    itemId: string,
    value: string,
    category: Categories,
    isMain: boolean
}

export interface ConnectItemRequest {
    itemId: string,
    userId: string,
    category: Categories,
    isMain: boolean
}

export const userdataAPI = createApi({
    reducerPath: 'userdataAPI',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['items'],
    endpoints: (build) => ({
        fetchUserPersonalInfoById: build.query<UserModel, UserByIdRequest>({
            query: (arg) => ({
                url: '/userdatausers',
                params: arg
            })
        }),
        // TODO: определять, какой именно слой персон!
        fetchUserPersonsById: build.query<UserModel, UserByIdRequest>({
            query: (arg) => ({
                url: '/userdatausers',
                params: arg
            })
        }),
        fetchUserItemsById: build.query<ItemModel[], ItemByIdRequest>({
            query: (arg) => ({
                url: '/userdataitems',
                //params: arg
            }),
            providesTags: result => ['items']
        }),
        updateItemRating: build.mutation<void, UpdateItemRequest>( {
            query: (arg) => ({
                url: `/userdataitems/${arg.itemId}`,
                body: {
                    rating: arg.value,
                },
                method: "PATCH"
            }),
            invalidatesTags: ['items']
        }),
        updateItemComment: build.mutation<void, UpdateItemRequest>( {
            query: (arg) => ({
                url: `/userdataitems/${arg.itemId}`,
                body: {
                    comment: arg.value
                },
                method: "PATCH"
            }),
            invalidatesTags: ['items']
        }),
        addItem: build.mutation<void, ConnectItemRequest>( {
            query: (arg) => ({
                url: `/userdataitems`,
                body: {
                    id: arg.itemId,
                    title: arg.itemId,
                    rating: 0
                },
                method: "POST"
            }),
            invalidatesTags: ['items']
        }),
        removeItem: build.mutation<void, ConnectItemRequest>( {
            query: (arg) => ({
                url: `/userdataitems/${arg.itemId}`,
                method: "DELETE"
            }),
            invalidatesTags: ['items']
        })
    })
});