import React, {useEffect, useState} from 'react';
import {Box, Tabs, Tab} from "@mui/material";
import {NavLink, useLocation} from "react-router-dom";
import {ROUTES} from "../../../router/routes";
import {useAppSelector} from "../../../hooks/redux";

const pages = [ROUTES.pages.account, ROUTES.pages.filter];

const getValueFromLocation = (pathname: string) : number => {
    const page_name = pathname.split('/')[1].toLowerCase();
    return pages.indexOf(page_name);
}

const NavTabs = () => {

    const textTabs = ['Профиль', 'Поиск'];

    const location = useLocation();

    const [value, setValue] = useState<number>(getValueFromLocation(location.pathname));

    useEffect(() => {
        const newValue = getValueFromLocation(location.pathname);
        handleChangeFunc(newValue);
    }, [location.pathname]);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        handleChangeFunc(newValue);
    }

    const handleChangeFunc = (newValue: number) => {
        setValue(newValue);
    }

    const userId = useAppSelector(state => state.authReducer.userId);

    return (
        <Box>
            <Tabs value={value}
                  onChange={handleChange}
                  color={"black"}
            >
                <Tab label={textTabs[0]} component={NavLink} to={`${ROUTES.pages.account}/${userId}`}/>
                <Tab label={textTabs[1]} component={NavLink} to={ROUTES.pages.filter}/>
            </Tabs>
        </Box>
    );
};

export default NavTabs;