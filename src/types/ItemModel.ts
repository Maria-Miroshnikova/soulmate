export interface ItemModel {
    id: string,
    // вообщем-то может title вычислять уже тут!
    title: string,
    rating: number,
    comment?: string
}