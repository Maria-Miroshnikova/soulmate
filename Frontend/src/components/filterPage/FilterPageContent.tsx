import React, {FC, useEffect, useState} from 'react';
import SearchNameDrawer from "./filter/SearchNameDrawer";
import {Box, Pagination, Typography} from "@mui/material";
import UserCard from "./usercard/UserCard";
import {useAppDispatch, useAppSelector} from "../../hooks/redux";
import {getSortedByPriority} from "../../utils/filterPage/getSortedByPriority";
import {FilterStatus, submitFilterEnd} from "../../store/reducers/filterPageFilterSlice";
//import {fetchUserCardsAll} from "../../store/reducers/action_creators/filter_fetch_usercards";
import {AppDispatch} from "../../store/store";
import {filterAPI} from "../../services/filterService";
import {UserCardInfo} from "../../types/UserCardInfo";
import {defaultFilter} from "../../types/FilterModel";
import {userdataAPI} from "../../services/userdataService";

// TODO: поручить разделение данных на пользовательские/найденные бэкэнду?
const FilterPageContent: FC = () => {

    const filterComponentsStatus = useAppSelector((state) => state.filterPageFilterReducer.filtes_categories_status);
    const filter = useAppSelector((state) => state.filterPageFilterReducer.filter);
    const filterStatus = useAppSelector((state) => state.filterPageFilterReducer.status);

    const dispatch = useAppDispatch();

    // TODO: придумать более адекватный способ отслеживания готовности фильтра....
    // --- сборка фильтра
    // TODO: это не цепляет NAME! починить
    useEffect(() => {
        if ((filterComponentsStatus.book) &&
            (filterComponentsStatus.film) &&
            (filterComponentsStatus.game) &&
            (filterComponentsStatus.music) && !(filterStatus === FilterStatus.SUBMITTED))
            dispatch(submitFilterEnd());
        //else if (filterStatus === FilterStatus.SUBMITTED)
        //    console.log(filter);
    }, [filterComponentsStatus, filterStatus]);

    const priority = useAppSelector((state) => state.priorityReducer.priority);

    const userId = useAppSelector((state) => state.authReducer.userId);
    //const {data: userData, isLoading: isLoadingUserData} = userdataAPI.useFetchUserByIdQuery({id: userId!});

    // из редакса:
    //const userCardsRaw = useAppSelector((state) => state.filterPageFoundUsersReducer.userCards);
    // из api ALL
    //const {data: userCardsRaw, error, isLoading, refetch} = filterAPI.useFetchUserCardsAllQuery();
    //console.log(userCardsRaw);
    // из api FILTER
    const {data: userCardsRaw, error, isLoading, refetch} = filterAPI.useFetchUserCardsByFilterQuery({userId: userId!, filter: filter, priority: priority});

    const [userCards, setUserCards] = useState<UserCardInfo[]>([]);
 //   console.log("cards:", userCardsRaw);

    // --- сортировка данных
    useEffect(() => {
        if (!(userCardsRaw === undefined)) {
            // это для приорита локально
            setUserCards(getSortedByPriority(userCardsRaw, priority));
            // это для удаленного
            //setUserCards(userCardsRaw);
        }
        else
            setUserCards([]);
    }, [userCardsRaw, priority]);


    // countCards, perPage = 10
    // countPagesInt = countCards / perPage;
    // countPages = (countPagesInt % perPage === 0) ? countPagesInt : countPagesInt + 1;
    // pageNumber
    const [pageNumber, setPageNumber] = useState<number>(1);
    const countPages = 10;

    const handleChangePage = (event:  React.ChangeEvent<unknown>, value: number) => {
        setPageNumber(value);
    }

    // TODO: сделать красивый loader
    // TODO: сделать pagination в запросе

    /*<Box alignSelf="center" marginTop={2}>
                    {
                        (isLoading) ?
                            null
                            :
                            <Pagination count={countPages} page={pageNumber} onChange={handleChangePage}/>
                    }
                </Box>*/
    return (
        <Box height="min-content" width="100%">
            <SearchNameDrawer countFound={userCards.length}/>
            <Box display="flex" flexDirection="column" marginLeft={2} marginTop={2} gap={2}>
                {
                    (isLoading) ?
                        <Typography> идет загрузка </Typography>
                        :
                        userCards.map((user) => <UserCard user={user} key={user.personal_data.id}/>)}

            </Box>
        </Box>
    );
};

export default FilterPageContent;