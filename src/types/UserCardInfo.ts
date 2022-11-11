import {Categories, CategoriesModel, CategoryModel} from "./Categories";
import {UserPersonalInfoModel} from "./UserModels";

export interface IUserCardInfo {
    personal_data: UserPersonalInfoModel,
    categories: CategoriesModel
}

export class UserCardInfo implements IUserCardInfo {
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
}