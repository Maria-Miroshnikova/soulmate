import {Categories} from "../../../types/Categories";
import {INavButton} from "../../../types/INavButton";
import {getFullCategoryPath, getFullFriendPath} from "../../../router/routes";
import {PersonListType} from "../lists/PersonList";

export const getCategoryTabs = (category: Categories, id: string): INavButton[] => {
    switch (category) {
        case Categories.FILM: {
            return [
                {
                    textBotton: 'Кино',
                    category: category,
                    isFiends: false,
                    isProfile: false,
                    url_to: getFullCategoryPath(category, true, id)
                },
                {
                    textBotton: 'Персоны',
                    category: category,
                    isFiends: false,
                    isProfile: false,
                    url_to: getFullCategoryPath(category, false, id)
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
                    url_to: getFullCategoryPath(category, true, id)
                },
                {
                    textBotton: 'Исполнители',
                    category: category,
                    isFiends: false,
                    isProfile: false,
                    url_to: getFullCategoryPath(category, false, id)
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
                    url_to: getFullCategoryPath(category, true, id)
                },
                {
                    textBotton: 'Студии',
                    category: category,
                    isFiends: false,
                    isProfile: false,
                    url_to: getFullCategoryPath(category, false, id)
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
                    url_to: getFullCategoryPath(category, true, id)
                },
                {
                    textBotton: 'Авторы',
                    category: category,
                    isFiends: false,
                    isProfile: false,
                    url_to: getFullCategoryPath(category, false, id)
                }
            ];
        }
    }
}

export const getFriendsTabs = (id: string): INavButton[] => {
    return [
        {
            textBotton: 'Друзья',
            isFiends: true,
            isProfile: false,
            url_to: getFullFriendPath(PersonListType.FRIENDS, id)
        },
        {
            textBotton: 'Заявки',
            isFiends: true,
            isProfile: false,
            url_to: getFullFriendPath(PersonListType.REQUESTS, id)
        },
        {
            textBotton: 'Посещенные',
            isFiends: true,
            isProfile: false,
            url_to: getFullFriendPath(PersonListType.VISITED, id)
        },
    ];
}