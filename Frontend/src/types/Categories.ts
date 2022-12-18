
export enum Categories {
    FILM,
    MUSIC,
    GAME,
    BOOK
}

// хранят в себе только idx!
export interface CategoryModel {
    main_category: string[],
    sub_category: string[]
}

const defaultCategoryModel = {
    main_category: [],
    sub_category: []
}

export interface CategoriesModel {
    book: CategoryModel,
    game: CategoryModel,
    film: CategoryModel,
    music: CategoryModel
}

export const defaultCaterogriesModel: CategoriesModel = {
    book: defaultCategoryModel,
    game: defaultCategoryModel,
    film: defaultCategoryModel,
    music: defaultCategoryModel
}

export const extractCategoryFromCategories = (categories: CategoriesModel, category: Categories) => {
    switch (category) {
        case Categories.FILM: return categories.film;
        case Categories.BOOK: return categories.book;
        case Categories.GAME: return categories.game;
        case Categories.MUSIC: return categories.music;
    }
}