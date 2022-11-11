
export enum SearchBarUseCase {
    FILTERPAGE,
    USER_ITEMS,
    FRIEND_ITEMS
}

export interface ISearchBar {
    countFoundText: string,
    notFoundText: string,
    searchTextFieldLabelText: string
}

export const SearchBarText = (useCase: SearchBarUseCase): ISearchBar => {
    switch (useCase) {
        case SearchBarUseCase.FILTERPAGE:
            return {
                countFoundText: "Soulmates: ",
                notFoundText: "No Soulmates found.",
                searchTextFieldLabelText: "Введие имя для поиска ..."
            };
        case SearchBarUseCase.FRIEND_ITEMS:
            return {
                countFoundText: "",
                notFoundText: "",
                searchTextFieldLabelText: ""
            };
        case SearchBarUseCase.USER_ITEMS:
            return {
                countFoundText: "Найдено: ",
                notFoundText: "Не найдено совпадений по запросу.",
                searchTextFieldLabelText: "Искать в названии ..."
            };
    }
}