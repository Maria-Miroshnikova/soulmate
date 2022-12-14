import React, {FC, ReactNode} from 'react';
import {Box, Button, Divider, Typography} from "@mui/material";
import FilterTemplate from "../../filterPage/filter/FilterTemplate";
import {Categories} from "../../../types/Categories";
import Priority from "../../filterPage/priority/Priority";
import {Outlet} from "react-router";

interface MyDrawerProps {
    children: ReactNode
}

const MyDrawer: FC<MyDrawerProps> = ({children}) => {

    const drawerWidth = "360px";

    return (
        <Box
            height="100%"
            minHeight="100hv"
            flexDirection="column"
            display="flex">
            <Box
                height="100%"
                flexGrow="1"
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
                {children}
            </Box>
        </Box>
    );
};

export default MyDrawer;