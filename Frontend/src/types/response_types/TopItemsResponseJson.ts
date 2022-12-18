export interface TopItemJson {
    id: string,
    title: string,
    rating: number,
    review?: string
}

export interface TopItemsResponseJson {
    Items: TopItemJson[]
}