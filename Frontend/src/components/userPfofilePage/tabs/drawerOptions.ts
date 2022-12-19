import {Categories} from "../../../types/Categories";
import {INavButton} from "../../../types/INavButton";
import {getFullCategoryPath, getFullFriendPath, getFullProfilePath} from "../../../router/routes";
import {PersonType} from "../../../types/PersonType";

export const getDrawerOptions = (isUserProfile: boolean, id: string): INavButton[] => {
    return (isUserProfile) ?
        [
            {
                textBotton: 'Aккаунт',
                isProfile: true,
                isFiends: false,
                url_to: getFullProfilePath(id)
            },
            {
                textBotton: 'Друзья',
                isProfile: false,
                isFiends: true,
                url_to: getFullFriendPath(PersonType.FRIENDS, id)
            },
         /*   {
                textBotton: 'Подписки',
                isProfile: false,
                isFiends: false,
                url_to: getFullFriendPath(PersonType.FRIENDS, id)
            },*/
            {
                textBotton: 'Кино',
                isProfile: false,
                isFiends: false,
                category: Categories.FILM,
                url_to: getFullCategoryPath(Categories.FILM, true, id)
            },
            {
                textBotton: 'Книги',
                isProfile: false,
                isFiends: false,
                category: Categories.BOOK,
                url_to: getFullCategoryPath(Categories.BOOK, true, id)
            },
            {
                textBotton: 'Музыка',
                isProfile: false,
                isFiends: false,
                category: Categories.MUSIC,
                url_to: getFullCategoryPath(Categories.MUSIC, true, id)
            },
            {
                textBotton: 'Игры',
                isProfile: false,
                isFiends: false,
                category: Categories.GAME,
                url_to: getFullCategoryPath(Categories.GAME, true, id)
            }
        ]
    :
        [
            {
                textBotton: 'Aккаунт',
                isProfile: true,
                isFiends: false,
                url_to: getFullProfilePath(id)
            },
            {
                textBotton: 'Кино',
                isProfile: false,
                isFiends: false,
                category: Categories.FILM,
                url_to: getFullCategoryPath(Categories.FILM, true, id)
            },
            {
                textBotton: 'Книги',
                isProfile: false,
                isFiends: false,
                category: Categories.BOOK,
                url_to: getFullCategoryPath(Categories.BOOK, true, id)
            },
            {
                textBotton: 'Музыка',
                isProfile: false,
                isFiends: false,
                category: Categories.MUSIC,
                url_to: getFullCategoryPath(Categories.MUSIC, true, id)
            },
            {
                textBotton: 'Игры',
                isProfile: false,
                isFiends: false,
                category: Categories.GAME,
                url_to: getFullCategoryPath(Categories.GAME, true, id)
            }
        ]
}