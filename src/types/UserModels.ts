import {ItemModel} from "./ItemModel";

// TODO: не set?
export interface UserCategoryModel {
    main_category: ItemModel[],
    sub_category: ItemModel[]
}

export interface UserCategoriesModel {
    book: UserCategoryModel,
    game: UserCategoryModel,
    film: UserCategoryModel,
    music: UserCategoryModel
}

export interface UserPersonalInfoModel {
    id: string,
    nickname: string,
    avatar: string,
    age: string,
    gender: string,
    telegram: string
}

export interface PersonsModel {
    friends: UserPersonalInfoModel[],
    visited: UserPersonalInfoModel[],
    requests: UserPersonalInfoModel[]
}

export interface UserModel {
    personal_data: UserPersonalInfoModel,
    categories: UserCategoriesModel,
    persons: PersonsModel
}