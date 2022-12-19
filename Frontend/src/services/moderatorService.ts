import {createApi} from "@reduxjs/toolkit/dist/query/react";
import {baseQueryWithReauth} from "./baseQueryFunctions";
import {UserCardInfo} from "../types/UserCardInfo";
import {CommentModel} from "../types/CommentModel";
import {UserPersonsResponseJson} from "../types/response_types/UserPersonsResponseJson";
import {UserPersonalInfoModel} from "../types/UserModels";
import {UserInfoRequestJson} from "../types/response_types/userInfoJson";
import {ModeratorCommentResponseJson} from "../types/response_types/ModeratorCommentResponseJson";

export interface ModeratorCommentsRequest {
    moderatorId: string
}

export interface CommentStatusUpdateRequest {
    comment: CommentModel,
    moderatorId: string
}

export const moderatorAPI = createApi({
    reducerPath: 'moderatorAPI',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['comments'],
    endpoints: (build) => ({
        fetchComments: build.query<CommentModel[], ModeratorCommentsRequest>({
            query: (arg) => ({
                url: `/moderator`,
                params: arg
            }),
            transformResponse: (response: ModeratorCommentResponseJson, meta, arg) => {
                /*const result: UserPersonalInfoModel[] = [];
                for (var i = 0; i < response.FoundUsers.length; ++i) {
                    const user: UserInfoRequestJson = response.FoundUsers[i];
                    console.log("user", user.User.username)
                    result.push({
                        id: user.User.id,
                        nickname: user.User.username,
                        avatar: "",
                        age: user.User.age,
                        gender: user.User.gender,
                        telegram: user.User.telegram
                    })
                }
                return result;*/
                return [];
            },
            providesTags: result => ['comments']
        }),
        approveComment: build.mutation<void, CommentStatusUpdateRequest>({
            query: (arg) => ({
                url: `/moderator`,
                method: 'POST',
                body: arg
            }),
            invalidatesTags: ['comments']
        }),
        rejectComment: build.mutation<void, CommentStatusUpdateRequest>({
            query: (arg) => ({
                url: `/moderator`,
                method: 'POST',
                body: arg
            }),
            invalidatesTags: ['comments']
        })
    })
})

/*
comment: {
    item: {
        id: string,
        title: string,
        rating: number,
        comment?: string
        commentIsRejected?: boolean
    },
    category: Categories,
    isMain: boolean,
    userId: string
},
moderatorId: string
 */