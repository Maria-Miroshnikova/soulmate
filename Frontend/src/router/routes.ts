import {Categories} from "../types/Categories";
import {PersonType} from "../components/userPfofilePage/lists/PersonList";

export const getFullCategoryPath = (category: Categories, isMain: boolean, id: string): string => {
    const url = ROUTES.base_url + ROUTES.pages.account + '/' + id + '/';
    switch (category) {
        case Categories.GAME: {
            return (isMain) ? url + ROUTES.content_tabs.games.games_main : url + ROUTES.content_tabs.games.games_sub;
        }
        case Categories.BOOK: {
            return (isMain) ? url + ROUTES.content_tabs.books.books_main : url + ROUTES.content_tabs.books.books_sub;
        }
        case Categories.FILM: {
            return (isMain) ? url + ROUTES.content_tabs.films.films_main : url + ROUTES.content_tabs.films.films_sub;
        }
        case Categories.MUSIC: {
            return (isMain) ? url + ROUTES.content_tabs.music.music_main : url + ROUTES.content_tabs.music.music_sub;
        }
    }
}

export const getFullFriendPath = (type: PersonType, id: string): string => {
    const url = ROUTES.base_url + ROUTES.pages.account + '/' + id + '/';
    switch (type) {
        case PersonType.FRIENDS: return url + ROUTES.content_tabs.friends.friends_main;
        case PersonType.REQUESTS: return url + ROUTES.content_tabs.friends.requests;
        case PersonType.VISITED: return url + ROUTES.content_tabs.friends.visited;
        default: return "";
    }
}

export const getFullProfilePath = (id: string): string => {
    return ROUTES.base_url + ROUTES.pages.account + '/' + id + '/' + ROUTES.content_tabs.profile;
}

export const ROUTES = {
    pages: {
        filter: "filter",
        account: "account",
        login: "login",
        registr: "registration",
        moderator: "moderator"
    },
    content_tabs: {
        profile: "profile",
        films: {
            films_main: "films",
            films_sub: "film_authors"
        },
        books: {
            books_main: "books",
            books_sub: "book_authors"
        },
        music: {
            music_main: "songs",
            music_sub: "music_authors"
        },
        games: {
            games_main: "games",
            games_sub: "game_studios"
        },
        friends: {
            friends_main: "friends",
            visited: "visited",
            requests: "requests"
        }
    },
    base_url: "/"
}

export const getIdFromPath = (path: string): string => {
    const parts = path.split('/');
    return parts[2];
}