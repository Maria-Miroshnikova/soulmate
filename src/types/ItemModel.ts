
/*export enum CommentStatus {
    ON_MODERATION,
    APPROVED,
    REJECTED
}*/

//TODO: вообщем-то может title вычислять уже тут!
export interface ItemModel {
    id: string,
    title: string,
    rating: number,
    comment?: string
    commentIsRejected?: boolean
}