import React, {FC, useEffect} from 'react';
import {Box} from "@mui/material";
import ItemCardFriend from "../itemcard/ItemCardFriend";
import {useAppDispatch, useAppSelector} from "../../../hooks/redux";
import {userdataAPI} from "../../../services/userdataService";
import {ItemListProps} from "./ItemListLayout";
import {setCountFound} from "../../../store/reducers/searchContentSlice";
import {useLocation} from "react-router-dom";

// TODO: возможно, подсвечивать другим цветом ваши общие кино и т д!
const ItemOfFriendList: FC<ItemListProps> = ({category, isMain}) => {

    const title = useAppSelector(state => state.searchConentReducer.title);

    const personId = useAppSelector(state => state.searchConentReducer.pageId);
    const {data: items, isLoading} = userdataAPI.useFetchUserItemsByIdQuery({userId: personId!, category: category, isMain: isMain, title: title});
    console.log("friends items: ", items);


    const dispatch = useAppDispatch();
    const location = useLocation();

    // обновление coundFound
    useEffect(() => {
        if (!isLoading) {
            dispatch(setCountFound(items!.length));
        }
    }, [isLoading, items, location.pathname])


    return (isLoading) ?
        <Box> Loading... </Box>
        :
        (
            <Box display="flex" flexDirection="column" gap={2}>
                { items!.map(item =>  <ItemCardFriend item={item} category={category} isMain={isMain}/>) }
            </Box>)
        ;
};

export default ItemOfFriendList;