import {Categories, CategoriesModel, defaultCaterogriesModel} from "./Categories";
import {DefaultDictionary, Dictionary} from "typescript-collections";


// TODO: title - это уже локальная сортировка или удаленная?
// кажется, что если фильтр не поменялся, надо добавить опцию, не дающую новое обращение к серверу сделать
export interface FilterModel {
    title?: string,
    filter_categories: CategoriesModel,
    checkboxes: FilterCheckboxesModel;
}

export interface FilterCheckboxModel {
    main_category: boolean,
    sub_category: boolean
}

const defaultFilterCheckboxModel = {
    main_category: true,
    sub_category: true
}

export interface FilterCheckboxesModel {
    book: FilterCheckboxModel,
    film: FilterCheckboxModel,
    music: FilterCheckboxModel,
    game: FilterCheckboxModel
}

export const defaultFilterCheckboxesModel = {
    book: defaultFilterCheckboxModel,
    film: defaultFilterCheckboxModel,
    music: defaultFilterCheckboxModel,
    game: defaultFilterCheckboxModel
}

export const defaultFilter: FilterModel = {
    filter_categories: defaultCaterogriesModel,
    checkboxes: defaultFilterCheckboxesModel
}