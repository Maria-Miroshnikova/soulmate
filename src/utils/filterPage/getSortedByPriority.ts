import {UserCardInfo} from "../../types/UserCardInfo";
import {Categories} from "../../types/Categories";

//TODO
//const comparator by Count of full count of ...
// TODO
// оставить это работу бэкэнду? пока что не работает MULTI!

/*const priority_localStorage = "priority";
  const priority_str: any = localStorage.getItem(priority_localStorage);
    console.log(priority_str);
    let priority: Categories[] = priority_str.split(',').map(Number);
    console.log(priority);*/


let PRIORITY : Categories[];

const compareByPriority = (a: UserCardInfo, b: UserCardInfo, category: Categories) : number => {
    let size_a : number, size_b : number;
    switch (category) {
        case Categories.MUSIC: {
            size_a = a.categories.music.main_category.length + a.categories.music.sub_category.length;
            size_b = b.categories.music.main_category.length + b.categories.music.sub_category.length;
            break;
        }
        case Categories.FILM: {
            size_a = a.categories.film.main_category.length + a.categories.film.sub_category.length;
            size_b = b.categories.film.main_category.length + b.categories.film.sub_category.length;
            break;
        }
        case Categories.GAME: {
            size_a = a.categories.game.main_category.length + a.categories.game.sub_category.length;
            size_b = b.categories.game.main_category.length + b.categories.game.sub_category.length;
            break;
        }
        case Categories.BOOK: {
            size_a = a.categories.book.main_category.length + a.categories.book.sub_category.length;
            size_b = b.categories.book.main_category.length + b.categories.book.sub_category.length;
            break;
        }
    }
    if (size_a > size_b)
        return -1;
    else if (size_a < size_b)
        return 1;
    else
        return 0;
}

const fullSize = (a: UserCardInfo) : number => {
    const b_size = a.categories.book.main_category.length + a.categories.book.sub_category.length;
    const g_size = a.categories.game.main_category.length + a.categories.game.sub_category.length;
    const f_size = a.categories.film.main_category.length + a.categories.film.sub_category.length;
    const m_size = a.categories.music.main_category.length + a.categories.music.sub_category.length;
    return b_size + g_size + f_size + m_size;
}

const comparatorByPriority = (a: UserCardInfo, b: UserCardInfo) : number => {

    const metrics = PRIORITY.map(i => compareByPriority(a, b, i));
    for (let i = 0; i < metrics.length; ++i)
    {
        if (metrics[i] < 0)
            return -1;
        else if (metrics[i] > 0)
            return 1;
    }
    return  0;
}

// byFullSize
const comparatorDEFAULT = (a: UserCardInfo, b: UserCardInfo) : number => {
    const size_a = fullSize(a);
    const size_b = fullSize(b);
    if (size_a > size_b)
        return -1;
    else if (size_a < size_b)
        return 1;
    else
        return 0;
}

// Сортируем по количество совпадений в категории
// TODO: ОЧЕНЬ медленное сравнение (просто кошмар, полный просчет по каждой категории)
// TODO: глобальная переменная ???????
// TODO: default по общему размеру отделен от категориального. А слитный? Чтобы среди МАКСИМУМА совпадений шло внутреннее.
// это требует изменить систему приоритетов....
export const getSortedByPriority = (userCards: UserCardInfo[], priority: Categories[]): UserCardInfo[] => {
    PRIORITY = priority;
    let sortedCards = [...userCards];
    // DEFAULT compare
    if (PRIORITY.length === 0)
        sortedCards.sort(comparatorDEFAULT);
    else
        sortedCards.sort(comparatorByPriority);
    return sortedCards;
}

// СХЕМА:
// if (1 приоритет равен)
// if (2 приоритет равен)
// ...
// проблема: доставать поля по приоритету
// функция compareByPriority