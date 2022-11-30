import {Categories} from "./Categories";

export interface INavButton {
    textBotton: string,
    category?: Categories,
    isFiends: boolean,
    isProfile: boolean,
    url_to: string
}