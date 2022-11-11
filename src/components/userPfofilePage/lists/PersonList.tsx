import React, {FC} from 'react';

export enum PersonListType {
    FRIENDS,
    VISITED,
    REQUESTS
}

interface PersonListProps {
    type: PersonListType
}

const PersonList: FC<PersonListProps> = ({type}) => {
    return (
        <div>
            {type}
        </div>
    );
};

export default PersonList;