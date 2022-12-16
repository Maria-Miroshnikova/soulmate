import {createApi} from "@reduxjs/toolkit/query/react";
import {baseQueryWithReauth} from "./baseQueryFunctions";
import {UserPersonalInfoModel} from "../types/UserModels";
import {ItemModel} from "../types/ItemModel";
import {Categories} from "../types/Categories";
import {PersonType} from "../components/userPfofilePage/lists/PersonList";
import {UserInfoRequestJson} from "../types/response_types/userInfoJson";
import {ItemJson, UserItemsRequestJson} from "../types/response_types/userItemsRequestJson";

const categoryParamByCategories = (category: Categories) : string => {
    switch (category) {
        case Categories.FILM: return 'film';
        case Categories.MUSIC: return 'music';
        case Categories.GAME: return 'game';
        case Categories.BOOK: return 'book';
    }
}

const typeOfConnectionByString = (type: string) : PersonType => {
    switch (type) {
        case "": return PersonType.NO_CONNECTION;
        case "user_is_follower": return PersonType.MY_REQUEST;
        case "friends": return PersonType.FRIENDS;
        case "person_is_followe": return PersonType.REQUESTS;
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
    title: string
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
                url: `/fetchTypeOfPersonForUser`
            }),
           /* transformResponse: (response: TypeOfConnetctionResponseJson , meta, arg) => {
                return {
                    personType: typeOfConnectionByString(response.type)
                }
            }*/
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
        // не сделан еще!
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
                method: "POST"
            }),
            invalidatesTags: ['userInfo']
        }),
        // TODO: edit avarat request!
        // НЕ СДЕЛАН ЕЩЕ
        deleteUserAccount: build.mutation<void, UserByIdRequest>({
            query: (arg) => ({
                url: `/userdatausers/${arg.userId}`,
                method: "POST"
            }),
            invalidatesTags: ['userInfo']
        }),
        // НЕ СДЕЛАН
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
                    case PersonType.MY_REQUEST: {
                        return ({
                            url: '/////'
                        })
                    }
                    default: {
                        return ({
                            url: '/visited'
                        })
                    }
                }
            },
            providesTags: result => ['persons']
        }),
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
                        comment: (item.review === null) ? undefined : item.review,
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
                    value: arg.value
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
                url: `/api/friends/`,
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
                url: `/api/requests/`,
                method: "POST",
                body: {
                    personId: arg.personId,
                    userId: arg.userId
                }
            }),
            invalidatesTags: ['persons']
        }),
        /// VISITED persons
        // TODO: попоросить не добавлять в посещенные друзей!
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
        /// FRIENDS persons
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
                url: `/requestscount/`,
                parmas: arg.userId
            }),
            /*transformResponse: (response , meta, arg) => {
                return {
                    response.
                }
            }*/
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