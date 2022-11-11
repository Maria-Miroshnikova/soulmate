import {Categories} from "../types/Categories";

export interface IUserAccordion{
    summary: {
        category: string,
        first: string,
        last: string
    },
    details: {
        first: string,
        last: string
    }
}

export const UserAccordionText = (category: Categories) : IUserAccordion =>  {
    switch (category) {
        case Categories.FILM: {
            return {
                summary: {
                    category: "КИНО",
                    first: "фильмов",
                    last: "персон"
                },
                details: {
                    first: "фильмам",
                    last: "персонам"
                }
            }
        }
        case Categories.MUSIC: {
            return {
                summary: {
                    category: "МУЗЫКА",
                    first: "песен",
                    last: "исполнителей"
                },
                details: {
                    first: "песням",
                    last: "исполнителям"
                }
            }
        }
        case Categories.GAME: {
            return {
                summary: {
                    category: "ИГРЫ",
                    first: "игр",
                    last: "студий"
                },
                details: {
                    first: "играм",
                    last: "студиям"
                }
            }
        }
        case Categories.BOOK: {
            return {
                summary: {
                    category: "КНИГИ",
                    first: "книг",
                    last: "авторов"
                },
                details: {
                    first: "книгам",
                    last: "авторам"
                }
            }
        }
    }
}