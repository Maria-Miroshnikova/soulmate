import {Categories} from "../types/Categories";

export interface IFilter{
    category: string,
    labelFirstTextField: string,
    labelLastTextField: string,
    labelFirstCheckBox: string,
    labelLastCheckBox: string
}

export const FiltersText = (category: Categories) : IFilter => {
    switch (category) {
        case Categories.FILM: {
            return {
                category: "КИНО",
                labelFirstTextField: "Добавить фильм / сериал ...",
                labelLastTextField: "Добавить актера / режиссёра ...",
                labelFirstCheckBox: "Учесть мой список кино",
                labelLastCheckBox: "Учесть мой список персон"
            }
        }
        case Categories.MUSIC: {
            return {
                category: "МУЗЫКА",
                labelFirstTextField: "Добавить песню ...",
                labelLastTextField: "Добавить исполнителя ...",
                labelFirstCheckBox: "Учесть мой список песен",
                labelLastCheckBox: "Учесть мой список исполнителей"
            }
        }
        case Categories.GAME: {
            return {
                category: "ИГРЫ",
                labelFirstTextField: "Добавить игру ...",
                labelLastTextField: "Добавить студию ...",
                labelFirstCheckBox: "Учесть мой список игр",
                labelLastCheckBox: "Учесть мой список студий"
            }
        }
        case Categories.BOOK: {
            return {
                category: "КНИГИ",
                labelFirstTextField: "Добавить книгу ...",
                labelLastTextField: "Добавить автора ...",
                labelFirstCheckBox: "Учесть мой список книг",
                labelLastCheckBox: "Учесть мой список авторов"
            }
        }
    }
}