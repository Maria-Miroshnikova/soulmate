import {ItemModel} from "./ItemModel";
import {Categories} from "./Categories";

export interface CommentModel {
    item: ItemModel,
    category: Categories,
    isMain: boolean,
    userId: string
}