import React, { useEffect, useReducer, useState } from 'react';
import {
    GOOGLE_CLIENT_ID,
    GOOGLE_SECRET_ID,
    GOOGLE_REDIRECT_URI,
    GOOGLE_TOKEN_REQUEST_URI,
} from '../../env';

const LoginCallBack = ({ location }) => {
    const [user, setUser] = useState({});
    const [accessToken, setAccessTok] = useState('');
    const [params, setParams] = useReducer(
        (prev, newParam) => {
            return [...prev, ...newParam];
        },
        [
            `code=${(location.search.match(/code=([^&]+)/) || [])[1]}`,
            `client_id=${GOOGLE_CLIENT_ID}`,
            `client_secret=${GOOGLE_SECRET_ID}`,
            `redirect_uri=${GOOGLE_REDIRECT_URI}`,
            'grant_type=authorization_code',
        ],
    );
    const qParams = params.join('&');

    useEffect(() => {
        const qParams = params.join('&');
        fetch(GOOGLE_TOKEN_REQUEST_URI + qParams, {
            method: 'POST',
            headers: {
                Host: 'oauth2.googleapis.com',
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        })
            .then((res) => res.json())
            .then((res) => {
                console.log(res);
                setParams([`access_token=${res.access_token}`]);
                setAccessTok(res.access_token);
            })
            .catch(console.error);
    }, []);

    useEffect(() => {
        const qqParams = params.join('&');
        console.log('access_token:   ' + accessToken);
        console.log(qqParams);

        fetch('https://www.googleapis.com/oauth2/v1/userinfo?access_token=' + accessToken, {
            method: 'GET',
            headers: {
                Host: 'www.googleapis.com',
            },
            Authorization: `Bearer ${accessToken}`,
        }).then((res) => console.log(res.json()));
    }, [accessToken]);

    return <p>{location.search}</p>;
};

export default LoginCallBack;
