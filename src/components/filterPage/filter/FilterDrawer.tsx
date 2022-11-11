import React, {FC} from 'react';
import {Box, Button, Divider, Typography} from "@mui/material";
import FilterTemplate from "./FilterTemplate";
import {Categories} from "../../../types/Categories";
import Priority from "../priority/Priority";
import {useAppDispatch} from "../../../hooks/redux";
import {submitFilterStart} from "../../../store/reducers/filterPageFilterSlice";
import FilterDrawerContent from "./FilterDrawerContent";

const FilterDrawer: FC = () => {

    const drawerWidth = "360px";
    return (
        <Box
            height="100%"
            width={drawerWidth}
            display="flex"
            flexDirection="column"
            flexShrink={0}
            sx={{
                paddingTop: 6,
                paddingLeft: 3,
                paddingRight: 3,
                backgroundColor: "white"
            }}
        >
            <FilterDrawerContent />
        </Box>
    );
};

export default FilterDrawer;