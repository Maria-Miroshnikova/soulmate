export interface UserCardJson {
    User: {
        telegram: string,
        id: string,
        gender: string,
        username: string,
        age: number
    },
    Film: string[]
    Director: string[]
    Book: string[]
    Author: string[],
    Game: string[],
    Studio: string[],
    Song: string[],
    Artist: string[]
}
export interface UserCardsByFilterJson {
    FoundUsers: UserCardJson[]
}