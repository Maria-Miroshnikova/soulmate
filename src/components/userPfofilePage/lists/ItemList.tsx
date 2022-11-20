import React, {FC, useEffect, useState} from 'react';
import {Categories} from "../../../types/Categories";
import {ItemModel} from "../../../types/ItemModel";
import {Box} from "@mui/material";
import ItemCardFriend from "../itemcard/ItemCardFriend";
import {useAppDispatch, useAppSelector} from "../../../hooks/redux";
import ItemCardBasic from "../itemcard/ItemCardBasic";
import ItemCardSearch from "../itemcard/ItemCardSearch";
import {userdataAPI} from "../../../services/userdataService";
import {ItemListProps} from "./ItemListLayout";
import {extractOptionFromOptions, OptionItemModel} from "../../../types/OptionModels";
import {filterAPI} from "../../../services/filterService";
import {setCountFound} from "../../../store/reducers/searchContentSlice";
import {useLocation} from "react-router-dom";

const ItemList: FC<ItemListProps> = ({category, isMain}) => {

    const title = useAppSelector(state => state.searchConentReducer.title);

    // Загрузка избранных пользователя
    const userId = useAppSelector(state => state.authReducer.userId);
    const {data: items, isLoading: isLoadingItems} = userdataAPI.useFetchUserItemsByIdQuery({userId: userId!, category: category, isMain: isMain, title: title});

    // Загрузка опций
    const {data: options, isLoading: isLoadingOptions} = filterAPI.useFetchOptionsQuery({category: category, isMain: isMain, title: title});
    const [opt_add, setOpt] = useState<OptionItemModel[]>([]);

    const dispatch = useAppDispatch();
    const location = useLocation();

    // Рассчет опций, доступных для добавления
    useEffect(() => {
        if (!isLoadingOptions && options && !isLoadingItems) {
            const items_ids = items!.map((item) => item.id);
            setOpt(options.filter((option) => { return !items_ids.includes(option.id)}));
            dispatch(setCountFound(items!.length));
        }
    }, [isLoadingOptions, isLoadingItems, items]);

    // обновление coundFound
    useEffect(() => {
        if (!isLoadingOptions && options && !isLoadingItems) {
            dispatch(setCountFound(items!.length));
        }
    }, [isLoadingOptions, isLoadingItems, items, location.pathname])

    return (isLoadingItems || isLoadingOptions) ?
            <Box> Loading... </Box>
            :
            (
                <Box display="flex" flexDirection="column" gap={2}>
                    { items!.map(item =>  <ItemCardBasic item={item} category={category} isMain={isMain}/>) }
                    { opt_add!.map(item =>  <ItemCardSearch option={item} category={category} isMain={isMain}/>) }
                </Box>
            );

};

export default ItemList;