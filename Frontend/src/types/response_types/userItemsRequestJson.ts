export interface ItemJson {
    id: string,
    title: string,
    comment?: string,
    rating: number
}

export interface UserItemsRequestJson {
    Items: ItemJson[]
}