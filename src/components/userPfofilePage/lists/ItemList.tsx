import React, {FC} from 'react';
import {Categories} from "../../../types/Categories";

interface ItemListProps {
    category: Categories,
    isMain: boolean
}

const ItemList: FC<ItemListProps> = ({category, isMain}) => {
    return (
        <div>

        </div>
    );
};

export default ItemList;