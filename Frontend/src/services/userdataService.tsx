import {createApi} from "@reduxjs/toolkit/query/react";
import {baseQueryWithReauth} from "./baseQueryFunctions";
import {UserPersonalInfoModel} from "../types/UserModels";
import {ItemModel} from "../types/ItemModel";
import {Categories} from "../types/Categories";
import {PersonType} from "../components/userPfofilePage/lists/PersonList";
import {UserInfoRequestJson} from "../types/response_types/userInfoJson";
import {UserCardInfo} from "../types/UserCardInfo";
import {UserCardJson, UserInfoJson} from "../types/response_types/userCardsByFilterJson";
import {ItemJson, UserItemsRequestJson} from "../types/response_types/userItemsRequestJson";

const categoryParamByCategories = (category: Categories) : string => {
    switch (category) {
        case Categories.FILM: return 'film';
        case Categories.MUSIC: return 'music';
        case Categories.GAME: return 'game';
        case Categories.BOOK: return 'book';
    }
}


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

export interface RequestsCountResponse {
    id: string,
    countRequests: number
}

export interface EditPersonalInfoRequest {
    id: string,
    nickname?: string,
    age?: string,
    gender?: string,
    telegram?: string
}

export interface PersonTypeResponse {
    personType: PersonType
}

export const POLLING_INTERVAL_COUNT_REQUESTS = 10000;

export const userdataAPI = createApi({
    reducerPath: 'userdataAPI',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['items', 'persons', 'userInfo'],
    endpoints: (build) => ({
        fetchTypeOfPersonForUser: build.query<PersonTypeResponse, ConnectPersonsRequest>({
            query: (arg) => ({
                url: `/fetchTypeOfPersonForUser`
            }),
        }),
        // in progress
        fetchUserPersonalInfoById: build.query<UserPersonalInfoModel, UserByIdRequest>({
            query: (arg) => ({
                url: `/userdatausers`,
                params: arg
            }),
            providesTags: result => ['userInfo'],
            transformResponse: (response: UserInfoRequestJson, meta, arg) => {
                return {
                    id: response.User.id,
                    nickname: response.User.username,
                    avatar: "",
                    age: response.User.age,
                    gender: response.User.gender,
                    telegram: response.User.telegram
                }
            }
        }),
        editUserPersonalInfoById: build.mutation<void, EditPersonalInfoRequest>({
            query: (arg) => ({
                url: `/userdatausers/${arg.id}`,
                body: {
                    id: arg.id,
                    nickname: arg.nickname,
                    age: arg.age,
                    gender: arg.gender,
                    telegram: arg.telegram,
                    //password: string
                },
                method: 'PATCH'
            }),
            invalidatesTags: ['userInfo']
        }),
        // TODO: edit avarat request!
        deleteUserAccount: build.mutation<void, UserByIdRequest>({
            query: (arg) => ({
                url: `/userdatausers/${arg.userId}`,
                method: 'DELETE'
            }),
            invalidatesTags: ['userInfo']
        }),
        // TODO: определять, какой именно слой персон!
        fetchUserPersonsById: build.query<UserPersonalInfoModel[], PersonsOfUserRequst>({
            query: (arg) => {
                switch (arg.personsType) {
                    case PersonType.VISITED: {
                        return ({
                            url: '/visited'
                        })
                    }
                    case PersonType.FRIENDS: {
                        return ({
                            url: '/friends'
                        })
                    }
                    case PersonType.REQUESTS: {
                        return ({
                            url: '/requests'
                        })
                    }
                }
            },
            providesTags: result => ['persons']
        }),
        // in progress
        fetchUserItemsById: build.query<ItemModel[], ItemByIdRequest>({
            query: (arg) => ({
                url: '/userdataitems',
                params: {
                    userId: arg.userId,
                    category: categoryParamByCategories(arg.category),
                    isMain: (arg.isMain) ? 'true' : 'false',
                    title: arg.title
                }
            }),
            providesTags: result => ['items'],
            transformResponse: (response: UserItemsRequestJson, meta, arg): ItemModel[] => {
                const result: ItemModel[] = [];
                for (var i = 0; i < response.Items.length; ++i) {
                    const item: ItemJson = response.Items[i];
                    result.push({
                        id: item.id,
                        title: item.title,
                        comment: item.review,
                        rating: item.rating
                    })
                }
                return result;
            }
        }),
        updateItemRating: build.mutation<void, UpdateItemRequest>( {
            query: (arg) => ({
                url: `/updateItemRating/${arg.itemId}`,
                body: {
                    rating: arg.value,
                },
                method: "PATCH"
            }),
            invalidatesTags: ['items']
        }),
        updateItemComment: build.mutation<void, UpdateItemRequest>( {
            query: (arg) => ({
                url: `/updateItemComment/${arg.itemId}`,
                body: {
                    comment: arg.value
                },
                method: "PATCH"
            }),
            invalidatesTags: ['items']
        }),
        addItem: build.mutation<void, ConnectItemRequest>( {
            query: (arg) => ({
                url: `/addItem`,
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
                url: `/removeItem/${arg.itemId}`,
                method: "DELETE"
            }),
            invalidatesTags: ['items']
        }),
        /// REQUEST persons
        acceptRequestToFriends: build.mutation<void, ConnectPersonsRequest>( {
            query: (arg) => ({
                url: `/friends`,
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
                url: `/requests/${arg.personId}`,
                method: "DELETE"
            }),
            invalidatesTags: ['persons']
        }),
        /// VISITED persons
        // TODO: попоросить не добавлять в посещенные друзей!
        requestPersonToBeFriends: build.mutation<void, ConnectPersonsRequest>( {
            query: (arg) => ({
                url: `/requestPersonToBeFriends/${arg.personId}`,
                method: "DELETE"
            }),
            invalidatesTags: ['persons']
        }),
        addPersonToVisited: build.mutation<void, ConnectPersonsRequest>( {
            query: (arg) => ({
                url: `/visited`,
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
                url: `/removePersonFromFriends/${arg.personId}`,
                method: "DELETE"
            }),
            invalidatesTags: ['persons']
        }),
        fetchUserCountOfRequestsToFriends: build.query<RequestsCountResponse, UserByIdRequest> ({
            query: (arg) => ({
                url: `/requestscount`
            })
        })
    })
});