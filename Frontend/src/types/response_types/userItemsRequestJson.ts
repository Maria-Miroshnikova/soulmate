export interface ItemJson {
    id: string,
    title: string,
    review?: string,
    rating: number
}

export interface UserItemsRequestJson {
    Items: ItemJson[]
}