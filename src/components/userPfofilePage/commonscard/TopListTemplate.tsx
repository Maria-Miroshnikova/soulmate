import React, {FC, useEffect, useState} from 'react';
import {ItemModel} from "../../../types/ItemModel";
import {Box, Grid, List, ListItem, Rating, Typography} from "@mui/material";
import CategoryListTemplate from "./CategoryListTemplate";
import {Categories} from "../../../types/Categories";
import {UserAccordionText} from "../../../text/UserAccordionText";
import {useAppSelector} from "../../../hooks/redux";
import {analizAPI} from "../../../services/analizService";

export interface TopListTemplateProps {
    isHighList: boolean,
    category: Categories,
    personId: string
}

// TODO нужно ли выкачивать прямо itemModel или упрощенную?
const TopListTemplate: FC<TopListTemplateProps> = ({isHighList, category, personId}) => {

    const textTopHigh = "Топ-5 высоких оценок";
    const textTopLow = "Топ-5 низких оценок";
    const textYours = "Ваша оценка";
    const textHis = "Оценка пользователя";

    // personId это именно второй чел!
    const userId = useAppSelector(state => state.authReducer.userId);

    const textCategories = UserAccordionText(category);

    // TODO: переделать на раздельный fetching либо добавить personId в request
    const {data: itemsMain, isLoading: isLoadingMain} = analizAPI.useFetchTopDataQuery({
        userId: personId,
        category: category,
        isMain: true,
        isHigh: isHighList
    });
    const {data: itemsSub, isLoading: isLoadingSub} = analizAPI.useFetchTopDataQuery({
        userId: personId,
        category: category,
        isMain: false,
        isHigh: isHighList
    });

    return (
        <Box display="flex" flexDirection="column" sx={{marginTop: 3}}>
            <Typography variant="h6" color="secondary"> {(isHighList) ? textTopHigh : textTopLow} </Typography>
            {
                (isLoadingMain || isLoadingSub) ?
                    <Box> Loading... </Box>
                    :
                    (<Grid display="flex" flexDirection="column" width="100%">
                        <Grid display="flex" flexDirection="row" gap={3}>
                            <Grid flexGrow={1}> <CategoryListTemplate title={textYours + " " + textCategories.summary.first} items={itemsMain!.userTop} /> </Grid>
                            <Grid flexGrow={1}> <CategoryListTemplate title={textHis} items={itemsMain!.personTop} /> </Grid>
                        </Grid>
                        <Grid display="flex" flexDirection="row" flexGrow={1} gap={3}>
                            <Grid flexGrow={1}> <CategoryListTemplate title={textYours + " " +  textCategories.summary.last} items={itemsSub!.userTop} /> </Grid>
                            <Grid flexGrow={1}> <CategoryListTemplate title={textHis} items={itemsSub!.personTop} /> </Grid>
                        </Grid>
                    </Grid>)
            }
        </Box>
    );
};

export default TopListTemplate;