import {Dictionary} from "typescript-collections";
import {Categories, CategoriesModel, CategoryModel} from "./Categories";

export interface OptionModel {
    main_category: Dictionary<string, string>,
    sub_category: Dictionary<string, string>
}

export interface OptionsModel {
    book: OptionModel,
    game: OptionModel,
    film: OptionModel,
    music: OptionModel
}

export const extractOptionFromOptions = (options:OptionsModel, category: Categories) => {
    switch (category) {
        case Categories.FILM: return options.film;
        case Categories.BOOK: return options.book;
        case Categories.GAME: return options.game;
        case Categories.MUSIC: return options.music;
    }
}

/*export const extractOptionsIdByTitle = (titlesMain: string[], titlesSub: string[], options: OptionModel): CategoryModel => {
    // как искать по словарю?
    let main = titlesMain.map((title) => {return options.main_category.});
}*/