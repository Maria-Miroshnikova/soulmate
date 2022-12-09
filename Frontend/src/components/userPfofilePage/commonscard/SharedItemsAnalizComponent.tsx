import React, {FC} from 'react';
import {ItemModel} from "../../../types/ItemModel";
import {Box, Typography} from "@mui/material";
import {IUserAccordion} from "../../../text/UserAccordionText";

export interface SharedItemsAnalizComponentProps {
    isLoading: boolean,
    itemsMain?: ItemModel[],
    itemsSub?: ItemModel[],
    title: string,
    textCategories: IUserAccordion
}
const SharedItemsAnalizComponent: FC<SharedItemsAnalizComponentProps> = ({isLoading, itemsMain, itemsSub, title, textCategories}) => {

    const textNoSharedItems = "Не нашлось :(";

    return (
        <Box display="flex" flexDirection="row">
            <Typography> {title} </Typography>
            <Typography align="center" flexGrow="1" >
            {
                (isLoading) ?
                    ("Loading...")
                    :
                    ((itemsSub!.length === 0) && (itemsMain!.length === 0)) ?
                        (textNoSharedItems)
                        :
                        (itemsMain!.length + " " + textCategories.summary.first + " / " + itemsSub!.length + " " + textCategories.summary.last)

            }
            </Typography>
        </Box>
    );
};

export default SharedItemsAnalizComponent;