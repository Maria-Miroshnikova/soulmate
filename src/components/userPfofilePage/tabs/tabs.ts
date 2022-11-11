import {Categories} from "../../../types/Categories";
import {INavButton} from "../../../types/INavButton";

export const getCategoryTabs = (category: Categories): INavButton[] => {
    switch (category) {
        case Categories.FILM: {
            return [
                {
                    textBotton: 'Кино',
                    category: category,
                    isFiends: false,
                    isProfile: false,
                    url_to: ""
                },
                {
                    textBotton: 'Персоны',
                    category: category,
                    isFiends: false,
                    isProfile: false,
                    url_to: ""
                }
                ];
        }
        case Categories.MUSIC: {
            return [
                {
                    textBotton: 'Песни',
                    category: category,
                    isFiends: false,
                    isProfile: false,
                    url_to: ""
                },
                {
                    textBotton: 'Исполнители',
                    category: category,
                    isFiends: false,
                    isProfile: false,
                    url_to: ""
                }
            ];
        }
        case Categories.GAME: {
            return [
                {
                    textBotton: 'Игры',
                    category: category,
                    isFiends: false,
                    isProfile: false,
                    url_to: ""
                },
                {
                    textBotton: 'Студии',
                    category: category,
                    isFiends: false,
                    isProfile: false,
                    url_to: ""
                }
            ];
        }
        case Categories.BOOK: {
            return [
                {
                    textBotton: 'Книги',
                    category: category,
                    isFiends: false,
                    isProfile: false,
                    url_to: ""
                },
                {
                    textBotton: 'Авторы',
                    category: category,
                    isFiends: false,
                    isProfile: false,
                    url_to: ""
                }
            ];
        }
    }
}

export const getFriendsTabs = (): INavButton[] => {
    return [
        {
            textBotton: 'Друзья',
            isFiends: true,
            isProfile: false,
            url_to: ""
        },
        {
            textBotton: 'Заявки',
            isFiends: true,
            isProfile: false,
            url_to: ""
        },
        {
            textBotton: 'Посещенные',
            isFiends: true,
            isProfile: false,
            url_to: ""
        },
    ];
}