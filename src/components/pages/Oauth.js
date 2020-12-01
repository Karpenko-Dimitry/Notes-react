import React, { useContext } from 'react';
import { useLocation, Redirect } from 'react-router-dom';

import { store } from '../../contexts/AuthContext';

const Oauth = () => {
    const location = useLocation();

    const token = location.search.match(/token=(.*)/)[1];
    const authContext = useContext(store);

    authContext.signIn(token);

    return <Redirect to="/" />;
};

export default Oauth;
