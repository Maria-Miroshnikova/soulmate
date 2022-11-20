import React from 'react';
import {useAppSelector} from "../../hooks/redux";

const UserPageProfileContent = () => {

    const userId = useAppSelector(state => state.authReducer.userId);
    const pageId = useAppSelector((state) => state.searchConentReducer.pageId);

    return (
        <div>
            PROFILE
        </div>
    );
};

export default UserPageProfileContent;