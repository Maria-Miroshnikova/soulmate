import React from 'react';
import {useAppDispatch} from "../../../hooks/redux";
import {submitFilterStart} from "../../../store/reducers/filterPageFilterSlice";
import {Box, Button, Divider, Typography} from "@mui/material";
import FilterTemplate from "./FilterTemplate";
import {Categories} from "../../../types/Categories";
import Priority from "../priority/Priority";

const FilterDrawerContent = () => {

    const filterText = "ФИЛЬТР";
    const priorityText = "ПРИОРИТЕТ";
    const buttonText = "Применить";

    const dispatch = useAppDispatch();

    const handleSubmit = () => {
        dispatch(submitFilterStart());
    }

    // TODO: collect info as from form
    // возможно, это компонент formcontrol!
    // его длина: фиксирован, всегда виден / пустая белая колонка до конца экрана?

    return (
        <Box>
            <Box display="flex" flexDirection="column" maxWidth="max-content">
                <Typography variant="h5" marginBottom={1}> {filterText} </Typography>
                <Divider/>
            </Box>
            <Box display="flex" flexDirection="column" gap={2} marginTop={3}>
                <FilterTemplate category={Categories.FILM} />
                <FilterTemplate category={Categories.GAME} />
                <FilterTemplate category={Categories.BOOK} />
                <FilterTemplate category={Categories.MUSIC} />
            </Box>
            <Box display="flex" flexDirection="column" maxWidth="max-content">
                <Typography variant="h5" marginTop={6} marginBottom={1}> {priorityText} </Typography>
                <Divider />
            </Box>
            <Box marginTop={3}>
                <Priority />
            </Box>
            <Button fullWidth variant="contained" color="primary" onClick={handleSubmit} sx={{marginTop: 4, marginBottom: 4}}> {buttonText} </Button>

        </Box>
    );
};

export default FilterDrawerContent;