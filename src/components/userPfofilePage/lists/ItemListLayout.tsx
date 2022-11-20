import React, {FC} from 'react';
import {Categories} from "../../../types/Categories";
import {useLocation} from "react-router-dom";
import {useAppSelector} from "../../../hooks/redux";
import ItemList from "./ItemList";
import ItemOfFriendList from "./ItemOfFriendList";

export interface ItemListProps {
    category: Categories,
    isMain: boolean
}

const ItemListLayout: FC<ItemListProps> = ({category, isMain}) => {

    const title = useAppSelector(state => state.searchConentReducer.title);

    const userId = useAppSelector(state => state.authReducer.userId);
    const location = useLocation();
    const isUserItemsList = (location.pathname.split('/')[2] === userId);

    return (isUserItemsList) ?
        (<ItemList category={category} isMain={isMain} />)
        :
        (<ItemOfFriendList category={category} isMain={isMain} />);
};

export default ItemListLayout;