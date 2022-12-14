import {createApi} from "@reduxjs/toolkit/query/react";
import {baseQueryWithReauth} from "./baseQueryFunctions";
import {UserPersonalInfoModel} from "../types/UserModels";
import {ItemModel} from "../types/ItemModel";
import {Categories} from "../types/Categories";
import {UserInfoRequestJson} from "../types/response_types/userInfoJson";
import {ItemJson, UserItemsRequestJson} from "../types/response_types/userItemsRequestJson";
import { PersonType } from "../types/PersonType";
import {UserPersonsResponseJson} from "../types/response_types/UserPersonsResponseJson";
import {UserInfoJson} from "../types/response_types/userCardsByFilterJson";
import {TypeOfConnetctionResponseJson} from "../types/response_types/TypeOfConnetctionResponseJson";

export const categoryParamByCategories = (category: Categories) : string => {
    switch (category) {
        case Categories.FILM: return 'film';
        case Categories.MUSIC: return 'music';
        case Categories.GAME: return 'game';
        case Categories.BOOK: return 'book';
    }
}

// TODO: подписчики
const personTypeToString = (type: PersonType): string => {
    switch (type) {
        case PersonType.FRIENDS: return "friends";
        case PersonType.MY_REQUEST: return "my_requests";
        case PersonType.REQUESTS: return "requests";
        case PersonType.VISITED: return "visited";
        case PersonType.SUBSCRIBERS: return "";
        default: return "";
    }
}

const typeOfConnectionByString = (type: string) : PersonType => {
    switch (type) {
        case "": return PersonType.NO_CONNECTION;
        case "user_is_follower": return PersonType.MY_REQUEST;
        case "friends": return PersonType.FRIENDS;
        case "person_is_follower": return PersonType.REQUESTS;
        case "visited": return PersonType.VISITED;
        default: return PersonType.NO_CONNECTION;
    }
}

export interface UserByIdRequest {
    userId: string
}

export interface PersonsOfUserRequst {
    userId: string,
    personsType: PersonType,
    title?: string
}

export interface ItemByIdRequest {
    userId: string,
    category: Categories,
    isMain: boolean,
    title?: string
}

export interface UpdateItemRequest {
    userId: string
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
                url: `/fetchTypeOfPersonForUser/`,
                params: arg
            }),
            transformResponse: (response: TypeOfConnetctionResponseJson , meta, arg) => {
                return {
                    personType: typeOfConnectionByString(response.type)
                }
            },
            providesTags: result => ['persons']
        }),
        fetchUserPersonalInfoById: build.query<UserPersonalInfoModel, UserByIdRequest>({
            query: (arg) => ({
                url: `/userdatausers/`,
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
        // TODO
        editUserPersonalInfoById: build.mutation<void, EditPersonalInfoRequest>({
            query: (arg) => ({
                url: `/api/editUserPersonalInfo/`,
                body: {
                    id: arg.id,
                    nickname: arg.nickname,
                    age: arg.age,
                    gender: arg.gender,
                    telegram: arg.telegram
                },
                method: "POST"
            }),
            invalidatesTags: ['userInfo']
        }),

        // TODO: edit avarat request!

        // TODO
        deleteUserAccount: build.mutation<void, UserByIdRequest>({
            query: (arg) => ({
                url: `/api/deleteUserAccount/`,
                body: {
                    id: arg.userId
                },
                method: "POST"
            }),
            invalidatesTags: ['userInfo']
        }),
        fetchUserPersonsById: build.query<UserPersonalInfoModel[], PersonsOfUserRequst>({
            query: (arg) => ({
                url: '/users_peers/',
                params: {
                    personType: personTypeToString(arg.personsType),
                    userId: arg.userId,
                    title: arg.title
                },
            }),
            transformResponse: (response: UserPersonsResponseJson, meta, arg) => {
                const result: UserPersonalInfoModel[] = [];
                for (var i = 0; i < response.FoundUsers.length; ++i) {
                    const user: UserInfoRequestJson = response.FoundUsers[i];
               //     console.log("user", user.User.username)
                    result.push({
                        id: user.User.id,
                        nickname: user.User.username,
                        avatar: ((user.User.avatar === null) || (user.User.avatar === undefined)) ? "" : user.User.avatar,
                        age: user.User.age,
                        gender: user.User.gender,
                        telegram: user.User.telegram
                    })
                }
                return result;
            },
            providesTags: result => ['persons']
        }),
        fetchUserItemsById: build.query<ItemModel[], ItemByIdRequest>({
            query: (arg) => ({
                url: '/userdataitems/',
                params: {
                    userId: arg.userId,
                    category: categoryParamByCategories(arg.category),
                    isMain: (arg.isMain) ? 'true' : 'false',
                    title: ((arg.title === null) || (arg.title === '')) ? undefined : arg.title
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
                        comment: ((item.review === null) || (item.review === '')) ? undefined : item.review,
                        rating: item.rating
                    })
                }
                return result;
            }
        }),
        updateItemRating: build.mutation<void, UpdateItemRequest>( {
            query: (arg) => ({
                url: `/api/updateItemRating/`,
                body: {
                    userId: arg.userId,
                    category: categoryParamByCategories(arg.category),
                    isMain: (arg.isMain) ? 'true' : 'false',
                    itemId: arg.itemId,
                    value: arg.value
                },
                method: "POST"
            }),
            invalidatesTags: ['items']
        }),
        updateItemComment: build.mutation<void, UpdateItemRequest>( {
            query: (arg) => ({
                url: `/api/updateItemComment/`,
                body: {
                    userId: arg.userId,
                    category: categoryParamByCategories(arg.category),
                    isMain: (arg.isMain) ? 'true' : 'false',
                    itemId: arg.itemId,
                    value: ((arg.value === null) || (arg.value === '')) ? undefined : arg.value,
                },
                method: "POST"
            }),
            invalidatesTags: ['items']
        }),
        addItem: build.mutation<void, ConnectItemRequest>( {
            query: (arg) => ({
                url: `/api/addItem/`,
                body: {
                    userId: arg.userId,
                    category: categoryParamByCategories(arg.category),
                    isMain: (arg.isMain) ? 'true' : 'false',
                    itemId: arg.itemId
                },
                method: "POST"
            }),
            invalidatesTags: ['items']
        }),
        removeItem: build.mutation<void, ConnectItemRequest>( {
            query: (arg) => ({
                url: `/api/removeItem/`,
                method: "POST",
                body: {
                    userId: arg.userId,
                    category: categoryParamByCategories(arg.category),
                    isMain: (arg.isMain) ? 'true' : 'false',
                    itemId: arg.itemId
                }
            }),
            invalidatesTags: ['items']
        }),
        /// REQUEST persons
        acceptRequestToFriends: build.mutation<void, ConnectPersonsRequest>( {
            query: (arg) => ({
                url: `/api/acceptRequestToFriends/`,
                method: "POST",
                body: {
                    personId: arg.personId,
                    userId: arg.userId
                },
            }),
            invalidatesTags: ['persons']
        }),
        denyRequstToFriends: build.mutation<void, ConnectPersonsRequest>( {
            query: (arg) => ({
                url: `/api/denyRequstToFriends/`,
                method: "POST",
                body: {
                    personId: arg.personId,
                    userId: arg.userId
                }
            }),
            invalidatesTags: ['persons']
        }),
        requestPersonToBeFriends: build.mutation<void, ConnectPersonsRequest>( {
            query: (arg) => ({
                url: `/api/requestPersonToBeFriends/`,
                method: "POST",
                body: {
                    personId: arg.personId,
                    userId: arg.userId
                }
            }),
            invalidatesTags: ['persons']
        }),
        addPersonToVisited: build.mutation<void, ConnectPersonsRequest>( {
            query: (arg) => ({
                url: `/api/visited/`,
                method: "POST",
                body: {
                    personId: arg.personId,
                    userId: arg.userId
                },
            }),
            invalidatesTags: ['persons']
        }),
        closeMyRequestToBeFriends: build.mutation<void, ConnectPersonsRequest>( {
            query: (arg) => ({
                url: `/api/closeMyRequest/`,
                method: "POST",
                body: {
                    personId: arg.personId,
                    userId: arg.userId
                }
            }),
            invalidatesTags: ['persons']
        }),
        removePersonFromFriends: build.mutation<void, ConnectPersonsRequest>( {
            query: (arg) => ({
                url: `/api/removePersonFromFriends/`,
                method: "POST",
                body: {
                    personId: arg.personId,
                    userId: arg.userId
                }
            }),
            invalidatesTags: ['persons']
        }),
        fetchUserCountOfRequestsToFriends: build.query<RequestsCountResponse, UserByIdRequest> ({
            query: (arg) => ({
                url: `/countFollowers/`,
                params: arg
            }),
            transformResponse: (response: {count_followers: number} , meta, arg) => {
                return {
                    id: "",
                    countRequests: response.count_followers
                }
            }
        })
    })
});

/*
const localEndpoint = {
    fetchUserCountOfRequestsToFriends: `/requestscount/${arg.userId}`,
    removePersonFromFriends: `/friends/${arg.personId}`,
    addPersonToVisited: `/friends/${arg.personId}`,
    requestPersonToBeFriends: `/visited/${arg.personId}`,
    denyRequstToFriends: `/requests/${arg.personId}`,
    acceptRequestToFriends: `/friends`,
    removeItem: `/userdataitems/${arg.itemId}`,
    addItem: `/userdataitems`,
    updateItemComment: `/userdataitems/${arg.itemId}`,
    updateItemRating: `/userdataitems/${arg.itemId}`,
    deleteUserAccount: `/userdatausers/${arg.userId}`,
    editUserPersonalInfoById: `/userdatausers/${arg.id}`,
    fetchTypeOfPersonForUser: `/usertype`
}*/