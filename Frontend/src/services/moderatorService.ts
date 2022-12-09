import {createApi} from "@reduxjs/toolkit/dist/query/react";
import {baseQueryWithReauth} from "./baseQueryFunctions";
import {UserCardInfo} from "../types/UserCardInfo";
import {CommentModel} from "../types/CommentModel";

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
            }),
            providesTags: result => ['comments']
        }),
        approveComment: build.mutation<void, CommentStatusUpdateRequest>({
            query: (arg) => ({
                url: `/moderator`,
            }),
            invalidatesTags: ['comments']
        }),
        rejectComment: build.mutation<void, CommentStatusUpdateRequest>({
            query: (arg) => ({
                url: `/moderator`,
            }),
            invalidatesTags: ['comments']
        })
    })
})