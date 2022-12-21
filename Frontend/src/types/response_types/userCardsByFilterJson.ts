export interface UserInfoJson {
    telegram: string,
    id: string,
    gender: string,
    username: string,
    age: string,
    avatar: string
}

export interface UserCardJson {
    User: UserInfoJson,
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