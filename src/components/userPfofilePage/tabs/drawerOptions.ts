import {Categories} from "../../../types/Categories";
import {INavButton} from "../../../types/INavButton";

export const getDrawerOptions = (isUserProfile: boolean): INavButton[] => {
    return (isUserProfile) ?
        [
            {
                textBotton: 'Aккаунт',
                isProfile: true,
                isFiends: false,
                url_to: ""
            },
            {
                textBotton: 'Друзья',
                isProfile: false,
                isFiends: true,
                url_to: ""
            },
            {
                textBotton: 'Кино',
                isProfile: false,
                isFiends: false,
                category: Categories.FILM,
                url_to: ""
            },
            {
                textBotton: 'Книги',
                isProfile: false,
                isFiends: false,
                category: Categories.BOOK,
                url_to: ""
            },
            {
                textBotton: 'Музыка',
                isProfile: false,
                isFiends: false,
                category: Categories.MUSIC,
                url_to: ""
            },
            {
                textBotton: 'Игры',
                isProfile: false,
                isFiends: false,
                category: Categories.GAME,
                url_to: ""
            }
        ]
    :
        [
            {
                textBotton: 'Aккаунт',
                isProfile: true,
                isFiends: false,
                url_to: ""
            },
            {
                textBotton: 'Кино',
                isProfile: false,
                isFiends: false,
                category: Categories.FILM,
                url_to: ""
            },
            {
                textBotton: 'Книги',
                isProfile: false,
                isFiends: false,
                category: Categories.BOOK,
                url_to: ""
            },
            {
                textBotton: 'Музыка',
                isProfile: false,
                isFiends: false,
                category: Categories.MUSIC,
                url_to: ""
            },
            {
                textBotton: 'Игры',
                isProfile: false,
                isFiends: false,
                category: Categories.GAME,
                url_to: ""
            }
        ]
}