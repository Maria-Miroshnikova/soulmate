import {CategoriesModel, CategoryModel} from "../types/Categories";
import {OptionModel, OptionsModel} from "../types/OptionModels";
import {Dictionary} from "typescript-collections";
import {OptionItemModel} from "../types/OptionModels";

// TODO: перейти с Disctionary на array[ {id, title} ] ?

const number_dict = new Dictionary<string, string>();
const number_array = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
number_array.map((i) => {
   number_dict.setValue(i, i);
});
/*export const number_opt: OptionModel = {
    main_category: number_dict,
    sub_category: number_dict
}*/
export const number_opt: OptionModel = {
    main_category: number_array.map((value, index) => { return {id: index.toString(), title: value} }),
    sub_category: number_array.map((value, index) => { return {id: index.toString(), title: value} })
}

const film_main_dict = new Dictionary<string, string>();
const film_main_array = [ "Нефть", "Унесенные призраками", "Вечное сияние чистого разума", "Зодиак", "Дитя человеческое", "Отель 'Гранд Будапешт'", "Безумный Макс: Дорога Ярости", "Темный Рыцарь", "Гарри Поттер", "12 лет рабства", "Догвилль", "Волк с Уолл-стрит", "Титаник" ];
film_main_array.map((value, idx) => {
   film_main_dict.setValue(idx.toString(), value);
});
const film_sub_dict = new Dictionary<string, string>();
const film_sub_array = [ "Леонардо Ди Каприо", "Ларс фон Триер", "Джонни Депп", "Мадс Миккельсен", "Сара Полсон", "Эван Питерс", "Тильда Суинтон", "Кэтти Бэйтс", "Леди Гага" ];
film_sub_array.map((value, idx) => {
    film_sub_dict.setValue(idx.toString(), value);
});

/*export const film_opt:OptionModel = {
    main_category: film_main_dict,
    sub_category: film_sub_dict,
}*/
export const film_opt:OptionModel = {
    main_category: film_main_array.map((value, index) => {return {id: index.toString(), title: value}}),
    sub_category: film_sub_array.map((value, index) => {return {id: index.toString(), title: value}})
}

const book_main_dict = new Dictionary<string, string>();
const book_main_array= [ "Преступление и наказания", "Библия", "Вино из одуванчиков", "11/22/63", "Во весь голос", "Анна Каренина", "Хранители", "Романтика апокалипсиса", "Демиан", "Игра в бисер", "Степной волк", "Особое мнение", "Бегущий по лезвию" ];
book_main_array.map((value, idx) => {
    book_main_dict.setValue(idx.toString(), value);
});
const book_sub_dict = new Dictionary<string, string>();
const book_sub_array = [ "Достоевский Ф. М.", "Набоков В. В.", "Филлип Дик", "Брэдбери Р.", "Кинг С.", "Маяковский В. В.", "Толстой Л. Н.", "Гессе Г.", "Есенин C." ];
book_sub_array.map((value, idx) => {
    book_sub_dict.setValue(idx.toString(), value);
});
/*export const book_opt: OptionModel = {
    main_category: book_main_dict,
    sub_category: book_sub_dict,
}*/
export const book_opt: OptionModel = {
    main_category: book_main_array.map((value, index) => {return {id: index.toString(), title: value}}),
    sub_category: book_sub_array.map((value, index) => {return {id: index.toString(), title: value}})
}

const music_main_dict = new Dictionary<string, string>();
const music_main_array=[ "Highway to Hell - Metallica", "Yesterday - The Beatles", "Sonne - Rammstein", "Du richt - Rammstein", "Firestarter - Prodigy", "Spider - System of a Down", "Глаза - АукцЫон", "Философская песня о пуле - Егор Летов", "Rain Geometrics - H.U.V.A. Network"];
music_main_array.map((value, idx) => {
    music_main_dict.setValue(idx.toString(), value);
});
const music_sub_dict = new Dictionary<string, string>();
const music_sub_array=[ "Metallica", "The Beatles", "Rammstein", "System of a Down", "АуцкЫон", "Леонид Федоров", "Prodigy", "Queen", "Гражданская оборона" ];
music_sub_array.map((value, idx) => {
    music_sub_dict.setValue(idx.toString(), value);
});
/*export const music_opt: OptionModel = {
    main_category: music_main_dict,
    sub_category: music_sub_dict,
}*/
export const music_opt: OptionModel = {
    main_category: music_main_array.map((value, index) => {return {id: index.toString(), title: value}}),
    sub_category: music_sub_array.map((value, index) => {return {id: index.toString(), title: value}})
}

const game_main_dict = new Dictionary<string, string>();
const game_main_array=[ "Кирандия", "Машинариум", "Outlast", "Disco Elysium", "Arcanum", "Devour", "The Sims 3", "Zoo Tycoon 2", "Fallout", "Baba is you", "Pathologic 2", "Alien isolation", "Frostpunk" ];
game_main_array.map((value, idx) => {
    game_main_dict.setValue(idx.toString(), value);
});
const game_sub_dict = new Dictionary<string, string>();
const game_sub_array=[ "Red Barrels", "ZA/UM", "Sierra On-Line", "Westwood Studios", "11 bit Studios", "Ice-Pick Lodge"];
game_sub_array.map((value, idx) => {
    game_sub_dict.setValue(idx.toString(), value);
});
/*export const game_opt: OptionModel = {
    main_category: game_main_dict,
    sub_category: game_sub_dict,
}*/
export const game_opt: OptionModel = {
    main_category: game_main_array.map((value, index) => {return {id: index.toString(), title: value}}),
    sub_category: game_sub_array.map((value, index) => {return {id: index.toString(), title: value}})
}

export const options_: OptionsModel = {
    book: book_opt,
    film: film_opt,
    music: music_opt,
    game: game_opt,
}

export const number_options: OptionsModel = {
    book: number_opt,
    film: number_opt,
    music: number_opt,
    game: number_opt,
}