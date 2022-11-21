import {createApi} from "@reduxjs/toolkit/query/react";
import {baseQueryWithReauth} from "./baseQueryFunctions";
import {UserCardInfo} from "../types/UserCardInfo";
import {UserModel, UserPersonalInfoModel} from "../types/UserModels";
import {ItemModel} from "../types/ItemModel";
import {Categories} from "../types/Categories";
import {PersonType} from "../components/userPfofilePage/lists/PersonList";

export interface UserByIdRequest {
    userId: string
}

export interface PersonsOfUserRequst {
    userId: string,
    personsType: PersonType,
    title: string
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

export interface ConnectPersonsRequest {
    personId: string,
    userId: string
}

export const userdataAPI = createApi({
    reducerPath: 'userdataAPI',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['items', 'persons'],
    endpoints: (build) => ({
        fetchUserPersonalInfoById: build.query<UserPersonalInfoModel, UserByIdRequest>({
            query: (arg) => ({
                url: '/userdatausers',
                params: arg
            })
        }),
        // TODO: определять, какой именно слой персон!
        fetchUserPersonsById: build.query<UserPersonalInfoModel[], PersonsOfUserRequst>({
            query: (arg) => ({
                url: '/userdatapersons',
                params: arg
            }),
            providesTags: result => ['persons']
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
        }),
        /// REQUEST persons
        acceptRequestToFriends: build.mutation<void, ConnectPersonsRequest>( {
            query: (arg) => ({
                url: `/userdatapersons/${arg.personId}`,
                method: "POST",
                body: {
                    id: arg.personId,
                    nickname: arg.personId + "accept",
                    avatar: "",
                    age: "hz",
                    gender: "hz",
                    telegram: "added@t.me"
                },
            }),
            invalidatesTags: ['persons']
        }),
        denyRequstToFriends: build.mutation<void, ConnectPersonsRequest>( {
            query: (arg) => ({
                url: `/userdatapersons/${arg.personId}`,
                method: "DELETE"
            }),
            invalidatesTags: ['persons']
        }),
        /// VISITED persons
        requestPersonToBeFriends: build.mutation<void, ConnectPersonsRequest>( {
            query: (arg) => ({
                url: `/userdatapersons/${arg.personId}`,
                method: "DELETE"
            }),
            invalidatesTags: ['persons']
        }),
        addPersonToVisited: build.mutation<void, ConnectPersonsRequest>( {
            query: (arg) => ({
                url: `/userdatapersons/${arg.personId}`,
                method: "POST",
                body: {
                    id: arg.personId,
                    nickname: arg.personId + "visit",
                    avatar: "",
                    age: "hz",
                    gender: "hz",
                    telegram: "visited@t.me"
                },
            }),
            invalidatesTags: ['persons']
        }),
        /// FRIENDS persons
        removePersonFromFriends: build.mutation<void, ConnectPersonsRequest>( {
            query: (arg) => ({
                url: `/userdatapersons/${arg.personId}`,
                method: "DELETE"
            }),
            invalidatesTags: ['persons']
        }),
    })
});