import React, {FC, useEffect} from 'react';
import SearchNameDrawer from "./filter/SearchNameDrawer";
import {Box} from "@mui/material";
import UserCard from "./usercard/UserCard";
import {useAppDispatch, useAppSelector} from "../../hooks/redux";
import {getSortedByPriority} from "../../utils/filterPage/getSortedByPriority";
import {FilterStatus, submitFilterEnd} from "../../store/reducers/filterPageFilterSlice";

const FilterPageContent: FC = () => {

    // TODO: их еще надо в какой-то момент отсортировать по приоритету! После того, как их привезли с сервера.
    // статус: завезли => useEffect: сортируем (если приоритет был определен)
    // возможно, то же самое с именем?
    // TODO: фильтр приоритета работает с 1. Для нескольких приоритетов надо сделать тесты. + Дефолтный приоритет?
    // типа по наибольшему количеству совпадений вообще?
    const userCardsRaw = useAppSelector((state) => state.filterPageFoundUsersReducer.userCards);

    const priority = useAppSelector((state) => state.priorityReducer.priority);

    // TODO: временное. Убрать потом!
    const userCards = getSortedByPriority(userCardsRaw, priority);

    const filterComponentsStatus = useAppSelector((state) => state.filterPageFilterReducer.filtes_categories_status);
    const filter = useAppSelector((state) => state.filterPageFilterReducer.filter);
    const filterStatus = useAppSelector((state) => state.filterPageFilterReducer.status);

    const dispatch = useAppDispatch();

    // TODO: придумать более адекватный способ отслеживания готовности фильтра....
    useEffect(() => {
        if ((filterComponentsStatus.book) &&
            (filterComponentsStatus.film) &&
            (filterComponentsStatus.game) &&
            (filterComponentsStatus.music) && !(filterStatus === FilterStatus.SUBMITTED))
            dispatch(submitFilterEnd());
        //else if (filterStatus === FilterStatus.SUBMITTED)
        //    console.log(filter);
    }, [filterComponentsStatus, filterStatus]);

    return (
        <Box height="min-content" width="100%">
            <SearchNameDrawer countFound={userCards.length}/>
            <Box display="flex" flexDirection="column" marginLeft={2} marginTop={2} gap={2}>
                {userCards.map((user) => <UserCard user={user} key={user.personal_data.id}/>)}
            </Box>
        </Box>
    );
};

export default FilterPageContent;