import React, { useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { store } from '../../contexts/AuthContext';

const SignOut = () => {
    const authContext = useContext(store);
    const history = useHistory();

    useEffect(() => {
        authContext.signOut();
        history.push('/');
    }, [authContext, history]);

    return <></>;
};

export default SignOut;
