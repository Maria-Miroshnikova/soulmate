import {Categories} from "../types/Categories";

export const CommonCardText = (category: Categories) => {
    switch (category) {
        case Categories.FILM: {
            return {
                main: "Фильмы",
                sub: "Персоны"
            }
        }
        case Categories.BOOK: {
            return {
                main: "Книги",
                sub: "Авторы"
            }
        }
        case Categories.GAME: {
            return {
                main: "Игры",
                sub: "Студии"
            }
        }
        case Categories.MUSIC: {
            return {
                main: "Песни",
                sub: "Исполнители"
            }
        }
    }
}