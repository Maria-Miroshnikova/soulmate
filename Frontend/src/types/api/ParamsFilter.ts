import {FilterModel} from "../FilterModel";
import {makeRequestString} from "../../utils/api_convertations";
import {Categories} from "../Categories";


export interface IParamsFilter {
    userid: string,
    film_main?: string,
    is_film_main?: string,
    film_sub?: string,
    is_film_sub?: string,
    book_main?: string,
    is_book_main?: string,
    book_sub?: string,
    is_book_sub?: string,
    music_main?: string,
    is_music_main?: string,
    music_sub?: string,
    is_music_sub?: string,
    game_main?: string,
    is_game_main?: string,
    game_sub?: string,
    is_game_sub?: string,
    name?: string,
    id?: string,
    priority?: string
}

export const makeParamsFromFilter = (userId: string, filter: FilterModel, priority: Categories[]): Record<string, any> => {
    const result: IParamsFilter = {
        userid: userId,
        film_main: (filter.filter_categories.film.main_category.length > 0) ? makeRequestString(filter.filter_categories.film.main_category) : undefined,
        is_film_main: (filter.checkboxes.film.main_category) ? 'true' : undefined,
        film_sub: (filter.filter_categories.film.sub_category.length > 0) ? makeRequestString(filter.filter_categories.film.sub_category) : undefined,
        is_film_sub: (filter.checkboxes.film.sub_category) ? 'true' : undefined,
        book_main: (filter.filter_categories.book.main_category.length > 0) ? makeRequestString(filter.filter_categories.book.main_category) : undefined,
        is_book_main: (filter.checkboxes.book.main_category) ? 'true' : undefined,
        book_sub: (filter.filter_categories.book.sub_category.length > 0) ? makeRequestString(filter.filter_categories.book.sub_category) : undefined,
        is_book_sub: (filter.checkboxes.book.sub_category) ? 'true' : undefined,
        music_main: (filter.filter_categories.music.main_category.length > 0) ? makeRequestString(filter.filter_categories.music.main_category) : undefined,
        is_music_main: (filter.checkboxes.music.main_category) ? 'true' : undefined,
        music_sub: (filter.filter_categories.music.sub_category.length > 0) ? makeRequestString(filter.filter_categories.music.sub_category) : undefined,
        is_music_sub: (filter.checkboxes.music.sub_category) ? 'true' : undefined,
        game_main: (filter.filter_categories.game.main_category.length > 0) ? makeRequestString(filter.filter_categories.game.main_category) : undefined,
        is_game_main: (filter.checkboxes.game.main_category) ? 'true' : undefined,
        game_sub: (filter.filter_categories.game.sub_category.length > 0) ? makeRequestString(filter.filter_categories.game.sub_category) : undefined,
        is_game_sub: (filter.checkboxes.game.sub_category) ? 'true' : undefined,
        name: filter.title,
        priority: (priority.length > 0) ? priority.toString() : undefined
    }
    return result;
}