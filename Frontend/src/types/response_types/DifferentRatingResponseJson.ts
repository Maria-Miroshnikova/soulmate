export interface DifferentRatingJson {
    id: string,
    title: string,
    rating_user: number,
    rating_person: number
}

export interface DifferentRatingResponseJson {
    Items: DifferentRatingJson[]
}