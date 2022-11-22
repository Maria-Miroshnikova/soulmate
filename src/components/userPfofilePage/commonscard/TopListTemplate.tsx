import React, {FC} from 'react';
import {ItemModel} from "../../../types/ItemModel";
import {Box, List, ListItem, Rating, Typography} from "@mui/material";
import ListTemplate from "./ListTemplate";

export interface TopListTemplateProps {
    isHighList: boolean,
    yourMain: ItemModel[],
    yourSub: ItemModel[],
    hisMain: ItemModel[],
    hisSub: ItemModel[],
    textCategoryMain: string,
    textCategorySub: string
}

// TODO нужно ли выкачивать прямо itemModel или упрощенную?
const TopListTemplate: FC<TopListTemplateProps> = ({isHighList, yourMain, yourSub, hisMain, hisSub, textCategoryMain, textCategorySub}) => {

    const textTopHigh = "Топ-5 высоких оценок";
    const textTopLow = "Топ-5 низких оценок";
    const textYours = "Ваша оценка";
    const textHis = "Оценка пользователя";

    return (
        <Box display="flex" flexDirection="column" sx={{marginTop: 3}}>
            <Typography variant="h6" color="secondary"> {(isHighList) ? textTopHigh : textTopLow} </Typography>
            <Box display="flex" flexDirection="row" width="100%">
                <Box display="flex" flexDirection="column" flexGrow={1}>
                    <ListTemplate title={textYours + " " + textCategoryMain} items={yourMain} />
                    <ListTemplate title={textYours + " " + textCategorySub} items={yourSub} />
                </Box>
                <Box display="flex" flexDirection="column" flexGrow={1}>
                    <ListTemplate title={textHis} items={hisMain} />
                    <ListTemplate title={textHis} items={hisSub} />
                </Box>
            </Box>
        </Box>
    );
};

export default TopListTemplate;