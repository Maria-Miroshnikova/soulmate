
export enum Categories {
    FILM,
    MUSIC,
    GAME,
    BOOK
}

// TODO: НЕ Set?
// хранят в себе только idx!
export interface CategoryModel {
    main_category: string[],
    sub_category: string[]
}

export interface CategoriesModel {
    book: CategoryModel,
    game: CategoryModel,
    film: CategoryModel,
    music: CategoryModel
}

export const extractCategoryFromCategories = (categories: CategoriesModel, category: Categories) => {
    switch (category) {
        case Categories.FILM: return categories.film;
        case Categories.BOOK: return categories.book;
        case Categories.GAME: return categories.game;
        case Categories.MUSIC: return categories.music;
    }
}