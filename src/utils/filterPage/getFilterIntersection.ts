import {Categories, CategoryModel} from "../../types/Categories";
import {ItemModel} from "../../types/ItemModel";
import {useAppSelector} from "../../hooks/redux";
import {extractOptionFromOptions} from "../../types/OptionModels";

export const getFilterIntersection = (userCategory: CategoryModel, filterCategory: CategoryModel): CategoryModel => {
    let intersection: CategoryModel = { main_category: [], sub_category: []};
    intersection.main_category = userCategory.main_category.filter((value) => filterCategory.main_category.includes(value));
    intersection.sub_category = userCategory.sub_category.filter((value) =>  filterCategory.sub_category.includes(value));

    return intersection;
}

export const getFilterDifference = (userCategory: CategoryModel, intersectionCategory: CategoryModel): CategoryModel => {
    let difference: CategoryModel = { main_category: [], sub_category: []};
    difference.main_category = userCategory.main_category.filter((value) => !intersectionCategory.main_category.includes(value));
    difference.sub_category = userCategory.sub_category.filter((value) =>  !intersectionCategory.sub_category.includes(value));

    return difference;
}

/*export const getDifference = (items: ItemModel[], category: Categories, isMain: boolean): string[] => {
    const options_ontology = useAppSelector((state) => state.optionsReducer.categories);
    const options = extractOptionFromOptions(options_ontology!, category);
}*/