import React from 'react';
import { createContext, useReducer, useMemo } from 'react';

export const store = createContext();
const { Provider } = store;

export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(
        (prevState, action) => {
            switch (action.type) {
                case 'RESTORE_TOKEN':
                    return {
                        ...prevState,
                        isLoading: false,
                        isSignedIn: !!action.token,
                        token: action.token,
                    };
                case 'SIGN_IN':
                    return {
                        ...prevState,
                        isSignedIn: true,
                        token: action.token,
                    };
                case 'SIGN_OUT':
                    return {
                        ...prevState,
                        isSignedIn: false,
                        token: null,
                    };
                default:
            }
        },
        { isLoading: true, isSignedIn: null, token: null },
    );

    const authMemo = useMemo(
        () => ({
            signIn: async (access_token) => {
                localStorage.access_token = access_token;
                dispatch({ type: 'SIGN_IN', token: access_token });
            },
            signOut: () => {
                localStorage.removeItem('access_token');
                dispatch({ type: 'SIGN_OUT' });
            },
            isSignedIn: !!localStorage.access_token,
            getToken: () => state.token,
            restoreToken: () => {
                dispatch({
                    type: 'RESTORE_TOKEN',
                    token: localStorage.access_token,
                });
            },
        }),
        [state.token],
    );

    return <Provider value={authMemo}>{children}</Provider>;
};

export default { store, AuthProvider };