import React, {FC} from 'react';
import {Categories} from "../../../types/Categories";
import {ItemModel} from "../../../types/ItemModel";
import {Box} from "@mui/material";
import ItemCardFriend from "../itemcard/ItemCardFriend";
import {useAppSelector} from "../../../hooks/redux";
import ItemCardBasic from "../itemcard/ItemCardBasic";
import ItemCardSearch from "../itemcard/ItemCardSearch";

interface ItemListProps {
    category: Categories,
    isMain: boolean
}

const ItemList: FC<ItemListProps> = ({category, isMain}) => {

    const isUserPage = useAppSelector((state) => state.userItemPageReducer.isUserId);

    const items: ItemModel[] = [
        {
            comment: "lel",
            rating: 4,
            title: "lel lel",
            id: "1"
        },
        {
            rating: 2,
            title: "kik lel",
            id: "2"
        }
    ];

    const items_add: ItemModel[] = [
        {
            comment: "lel",
            rating: 4,
            title: "lel lel",
            id: "1"
        },
        {
            rating: 2,
            title: "kik lel",
            id: "2"
        }
    ]

    return (isUserPage) ?
        (
        <Box display="flex" flexDirection="column" gap={2}>
            { items.map(item =>  <ItemCardBasic item={item}/>) }
            { items.map(item =>  <ItemCardSearch item={item}/>) }
        </Box>
        )
        :
        (
            <Box display="flex" flexDirection="column" gap={2}>
                { items.map(item =>  <ItemCardFriend item={item}/>) }
            </Box>
        );
};

export default ItemList;