import {Categories, CategoriesModel} from "./Categories";
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

export interface FilterCheckboxesModel {
    book: FilterCheckboxModel,
    film: FilterCheckboxModel,
    music: FilterCheckboxModel,
    game: FilterCheckboxModel
}