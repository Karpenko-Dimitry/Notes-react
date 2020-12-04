import React, { useContext, useState } from 'react';

import { store } from '../../contexts/AuthContext';

import FormUserLogin from './FormUserLogin';
import FormNoteCreate from './FormNoteCreate';
import RangeByCategory from './RangeByCategory';

const SideBar = () => {
    const authContext = useContext(store);
    const [auth] = useState(authContext.isSignedIn());

    return (
        <aside className="col-lg-4 blog-sidebar">
            {auth && <FormNoteCreate />}
            {!auth && <FormUserLogin />}
            <RangeByCategory />
        </aside>
    );
};

export default SideBar;
