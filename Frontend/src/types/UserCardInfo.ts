import {Categories, CategoriesModel, CategoryModel} from "./Categories";
import {UserPersonalInfoModel} from "./UserModels";

export interface UserCardInfo {
    personal_data: UserPersonalInfoModel,
    categories: CategoriesModel
}

/*export class UserCardInfo implements IUserCardInfo {
    personal_data!: UserPersonalInfoModel;
    categories!: CategoriesModel;

    constructor(personal_data: UserPersonalInfoModel, categories: CategoriesModel) {
        this.personal_data = personal_data;
        this.categories = categories;
    }

    getData(category: Categories) : CategoryModel {
        switch (category) {
            case Categories.FILM: {
                return this.categories.film;
            }
            case Categories.GAME: {
                return this.categories.game;
            }
            case Categories.BOOK: {
                return this.categories.book;
            }
            case Categories.MUSIC: {
                return this.categories.music;
            }
        }
    }
}*/

export const getUserCardInfoCategory = (user: UserCardInfo, category: Categories) : CategoryModel => {
    switch (category) {
        case Categories.FILM: {
            return user.categories.film;
        }
        case Categories.GAME: {
            return user.categories.game;
        }
        case Categories.BOOK: {
            return user.categories.book;
        }
        case Categories.MUSIC: {
            return user.categories.music;
        }
    }
}