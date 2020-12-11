import React, { useContext } from 'react';

import { store } from '../../contexts/AuthContext';

import FormUserLogin from './FormUserLogin';
import FormNoteCreate from './FormNoteCreate';
import RangeByCategory from './RangeByCategory';

const SideBar = () => {
    const { isSignedIn } = useContext(store);

    return (
        <aside className="col-lg-4 blog-sidebar">
            {isSignedIn && <FormNoteCreate />}
            {!isSignedIn && <FormUserLogin />}
            <RangeByCategory />
        </aside>
    );
};

export default SideBar;
