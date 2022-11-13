import {CategoryModel} from "../types/Categories";
import {book_opt, film_opt, game_opt, music_opt, number_opt} from "./options";

/*const getItems = (opt: string[] , idx: number[]) : string[] => {
    return idx.map((i) => {return  opt[i]});
}*/

const getItems = (idx: number[]) : string[] => {
    return idx.map((i) => i.toString());
}

/*export const book_sets: CategoryModel[] = [
    {
        main_category: getItems(book_opt.main_category.keys(), [0, 1, 2, 3, 4, 5, 6]),
        sub_category: getItems(book_opt.sub_category.keys(), [0, 1, 2, 3, 4]),
    },
    {
        main_category: getItems(book_opt.main_category.keys(), [1, 4, 6]),
        sub_category: getItems(book_opt.sub_category.keys(), [0, 1, 4]),
    },
    {
        main_category: getItems(book_opt.main_category.keys(), [1, 2, 3, 6, 7]),
        sub_category: getItems(book_opt.sub_category.keys(), [3, 4]),
    },
    {
        main_category: getItems(book_opt.main_category.keys(), [0, 3, 6, 7]),
        sub_category: getItems(book_opt.sub_category.keys(), []),
    },
    {
        main_category: getItems(book_opt.main_category.keys(), []),
        sub_category: getItems(book_opt.sub_category.keys(), [1, 2, 3, 4]),
    }
];

export const film_sets: CategoryModel[] = [
    {
        main_category: getItems(film_opt.main_category.keys(), [0, 1, 2, 3, 4, 5, 6]),
        sub_category: getItems(film_opt.sub_category.keys(), [0, 1, 2, 3, 4]),
    },
    {
        main_category: getItems(film_opt.main_category.keys(), [1, 4, 6]),
        sub_category: getItems(film_opt.sub_category.keys(), [0, 1, 4]),
    },
    {
        main_category: getItems(film_opt.main_category.keys(), [1, 2, 3, 6, 7]),
        sub_category: getItems(film_opt.sub_category.keys(), [3, 4]),
    },
    {
        main_category: getItems(film_opt.main_category.keys(), [0, 3, 6, 7]),
        sub_category: getItems(film_opt.sub_category.keys(), []),
    },
    {
        main_category: getItems(film_opt.main_category.keys(), []),
        sub_category: getItems(film_opt.sub_category.keys(), [1, 2, 3, 4]),
    }
];

export const music_sets: CategoryModel[] = [
    {
        main_category: getItems(music_opt.main_category.keys(), [0, 1, 2, 3, 4, 5, 6]),
        sub_category: getItems(music_opt.sub_category.keys(), [0, 1, 2, 3, 4]),
    },
    {
        main_category: getItems(music_opt.main_category.keys(), [1, 4, 6]),
        sub_category: getItems(music_opt.sub_category.keys(), [0, 1, 4]),
    },
    {
        main_category: getItems(music_opt.main_category.keys(), [1, 2, 3, 6, 7]),
        sub_category: getItems(music_opt.sub_category.keys(), [3, 4]),
    },
    {
        main_category: getItems(music_opt.main_category.keys(), [0, 3, 6, 7]),
        sub_category: getItems(music_opt.sub_category.keys(), []),
    },
    {
        main_category: getItems(music_opt.main_category.keys(), []),
        sub_category: getItems(music_opt.sub_category.keys(), [1, 2, 3, 4]),
    }
];

export const game_sets: CategoryModel[] = [
    {
        main_category: getItems(game_opt.main_category.keys(), [0, 1, 2, 3, 4, 5, 6]),
        sub_category: getItems(game_opt.sub_category.keys(), [0, 1, 2, 3, 4]),
    },
    {
        main_category: getItems(game_opt.main_category.keys(), [1, 4, 6]),
        sub_category: getItems(game_opt.sub_category.keys(), [0, 1, 4]),
    },
    {
        main_category: getItems(game_opt.main_category.keys(), [1, 2, 3, 6, 7]),
        sub_category: getItems(game_opt.sub_category.keys(), [3, 4]),
    },
    {
        main_category: getItems(game_opt.main_category.keys(), [0, 3, 6, 7]),
        sub_category: getItems(game_opt.sub_category.keys(), []),
    },
    {
        main_category: getItems(game_opt.main_category.keys(), []),
        sub_category: getItems(game_opt.sub_category.keys(), [1, 2, 3, 4]),
    }
];*/

/*export const number_sets_1: CategoryModel[] = [
    {
        main_category: getItems(number_opt.main_category.keys(), [0, 3, 6, 7]),
        sub_category: getItems(number_opt.sub_category.keys(), []),
    },
    {
        main_category: getItems(number_opt.main_category.keys(), [1, 4, 6]),
        sub_category: getItems(number_opt.sub_category.keys(), [0, 1, 4]),
    },
    {
        main_category: getItems(number_opt.main_category.keys(), [1, 2, 3, 6, 7]),
        sub_category: getItems(number_opt.sub_category.keys(), [3, 4]),
    },
    {
        main_category: getItems(number_opt.main_category.keys(), []),
        sub_category: getItems(number_opt.sub_category.keys(), [1, 2, 3, 4]),
    },
    {
        main_category: getItems(number_opt.main_category.keys(), [0, 1, 2, 3, 4, 5, 6]),
        sub_category: getItems(number_opt.sub_category.keys(), [0, 1, 2, 3, 4]),
    },
];

export const number_sets_2: CategoryModel[] = [
    {
        main_category: getItems(number_opt.main_category.keys(), [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]),
        sub_category: getItems(number_opt.sub_category.keys(), [5]),
    },
    {
        main_category: getItems(number_opt.main_category.keys(), [1, 4, 6, 5, 3]),
        sub_category: getItems(number_opt.sub_category.keys(), [0]),
    },
    {
        main_category: getItems(number_opt.main_category.keys(), [6, 3]),
        sub_category: getItems(number_opt.sub_category.keys(), [3, 4, 2, 1]),
    },
    {
        main_category: getItems(number_opt.main_category.keys(), [2, 3]),
        sub_category: getItems(number_opt.sub_category.keys(), [1, 2, 3, 4, 5, 6]),
    },
    {
        main_category: getItems(number_opt.main_category.keys(), [4]),
        sub_category: getItems(number_opt.sub_category.keys(), []),
    },
];

export const number_sets_3: CategoryModel[] = [
    {
        main_category: getItems(number_opt.main_category.keys(), [8, 9]),
        sub_category: getItems(number_opt.sub_category.keys(), []),
    },
    {
        main_category: getItems(number_opt.main_category.keys(), [1]),
        sub_category: getItems(number_opt.sub_category.keys(), [0]),
    },
    {
        main_category: getItems(number_opt.main_category.keys(), [6]),
        sub_category: getItems(number_opt.sub_category.keys(), [3]),
    },
    {
        main_category: getItems(number_opt.main_category.keys(), []),
        sub_category: getItems(number_opt.sub_category.keys(), [1, 2, 3, 4, 5, 6]),
    },
    {
        main_category: getItems(number_opt.main_category.keys(), [4, 5, 2]),
        sub_category: getItems(number_opt.sub_category.keys(), [2]),
    },
];*/

export const number_sets_1: CategoryModel[] = [
    {
        main_category: getItems([0, 3, 6, 7]),
        sub_category: getItems([]),
    },
    {
        main_category: getItems([1, 4, 6]),
        sub_category: getItems([0, 1, 4]),
    },
    {
        main_category: getItems([1, 2, 3, 6, 7]),
        sub_category: getItems([3, 4]),
    },
    {
        main_category: getItems([]),
        sub_category: getItems([1, 2, 3, 4]),
    },
    {
        main_category: getItems([0, 1, 2, 3, 4, 5, 6]),
        sub_category: getItems([0, 1, 2, 3, 4]),
    },
];

export const number_sets_2: CategoryModel[] = [
    {
        main_category: getItems([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]),
        sub_category: getItems([5]),
    },
    {
        main_category: getItems([1, 4, 6, 5, 3]),
        sub_category: getItems([0]),
    },
    {
        main_category: getItems([6, 3]),
        sub_category: getItems([3, 4, 2, 1]),
    },
    {
        main_category: getItems([2, 3]),
        sub_category: getItems([1, 2, 3, 4, 5, 6]),
    },
    {
        main_category: getItems([4]),
        sub_category: getItems([]),
    },
];

export const number_sets_3: CategoryModel[] = [
    {
        main_category: getItems([8, 9]),
        sub_category: getItems([]),
    },
    {
        main_category: getItems([1]),
        sub_category: getItems([0]),
    },
    {
        main_category: getItems([6]),
        sub_category: getItems([3]),
    },
    {
        main_category: getItems([]),
        sub_category: getItems([1, 2, 3, 4, 5, 6]),
    },
    {
        main_category: getItems([4, 5, 2]),
        sub_category: getItems([2]),
    },
];