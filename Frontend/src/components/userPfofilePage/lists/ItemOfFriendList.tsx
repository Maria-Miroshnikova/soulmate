import React, {FC, useEffect} from 'react';
import {Box} from "@mui/material";
import ItemCardFriend from "../itemcard/ItemCardFriend";
import {useAppDispatch, useAppSelector} from "../../../hooks/redux";
import {POLLING_INTERVAL_COUNT_REQUESTS, userdataAPI} from "../../../services/userdataService";
import {ItemListProps} from "./ItemListLayout";
import {setCountFound} from "../../../store/reducers/searchContentSlice";
import {useLocation} from "react-router-dom";
import {
    getFilterDifferenceOnlyId,
    getFilterIntersection,
    getFilterIntersectionOnlyId
} from "../../../utils/filterPage/getFilterIntersection";

// TODO: возможно, подсвечивать другим цветом ваши общие кино и т д!
const ItemOfFriendList: FC<ItemListProps> = ({category, isMain}) => {

    const title = useAppSelector(state => state.searchConentReducer.title);

    const personId = useAppSelector(state => state.searchConentReducer.pageId);
    const {data: items, isLoading} = userdataAPI.useFetchUserItemsByIdQuery({userId: personId!, category: category, isMain: isMain, title: title}, {
         pollingInterval: POLLING_INTERVAL_COUNT_REQUESTS
    });
   // console.log("friends items: ", items);

    /*
    update: вывод совпадений/различий
     */

    // TODO:1
  //  const userId = useAppSelector(state => state.authReducer.userId);
  //  const {data: userItems, isLoading: isLoadingUserItems} = userdataAPI.useFetchUserItemsByIdQuery({userId: userId!, category: category, isMain: isMain, title: title});
    // обновлять их только когда загрузка произошла
  //  const intersectionId = getFilterIntersectionOnlyId(userItems!.map((item) => item.id), items!.map((item) => item.id));
  //  const differenceId = getFilterDifferenceOnlyId(userItems!.map((item) => item.id), intersectionId);
    ////////


    const dispatch = useAppDispatch();
    const location = useLocation();

    // обновление coundFound
    useEffect(() => {
        if (!isLoading) {
            dispatch(setCountFound(items!.length));
        }
    }, [isLoading, items, location.pathname])

    /*

     */

        // TODO:2
 //   { items!.filter((item) => intersectionId.includes(item.id)).map(item =>  <ItemCardFriend item={item} category={category} isMain={isMain}/>) }
 //   { items!.filter((item) => differenceId.includes(item.id)).map(item =>  <ItemCardFriend item={item} category={category} isMain={isMain}/>) }

    return (isLoading) ?
        <Box> Loading... </Box>
        :
        (
            <Box display="flex" flexDirection="column" gap={2}>
                { items!.map(item =>  <ItemCardFriend item={item} category={category} isMain={isMain} key={item.id}/>) }
            </Box>)
        ;
};

export default ItemOfFriendList;