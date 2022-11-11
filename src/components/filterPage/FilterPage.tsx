import React, {FC, useEffect, useState} from 'react';
import {Box} from "@mui/material";
import CustomAppBar from "../UI/CustomAppBar";
import FilterDrawer from "./filter/FilterDrawer";
import SearchNameDrawer from "./filter/SearchNameDrawer";
import UserCard from "./usercard/UserCard";
import {FilterModel} from "../../types/FilterModel";
import {useAppDispatch, useAppSelector} from "../../hooks/redux";
import {Categories, CategoryModel} from "../../types/Categories";
import {FilterStatus, submitFilterEnd} from "../../store/reducers/filterPageFilterSlice";
import {getSortedByPriority} from "../../utils/filterPage/getSortedByPriority";
import FilterPageContent from "./FilterPageContent";

const FilterPage: FC = () => {

    const sideMargin = "128px";

    return (
        <Box height="100%">
            <CustomAppBar />
            <Box width="100%" height="100%" sx={{ background: "gray"}}>
                <Box display="flex" flexDirection="row" height="100%" sx={{ marginLeft: sideMargin, marginRight: sideMargin}}>
                    <FilterDrawer />
                    <FilterPageContent />
                </Box>
            </Box>
        </Box>
    );
};

export default FilterPage;