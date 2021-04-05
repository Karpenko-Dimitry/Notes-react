import React, { useState, useCallback, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import AuthService from '../../services/AuthService';
import { store } from '../../contexts/AuthContext';
import { OAUTH_URL } from '../../env';
import favicon from '../images/note.png';

import Header from '../elements/Header';
import Spiner from '../elements/Spiner';

const SignIn = () => {
    const { t } = useTranslation(['common', 'title']);
    const history = useHistory();
    const authContext = useContext(store);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState(false);
    const [load, setLoad] = useState(false);

    const doLogin = useCallback(() => {
        setLoad(true);
        AuthService.signIn(email, password).then(
            (res) => {
                authContext.signIn(res.data.access_token);
                history.push('/');
            },
            (res) => setErrors(res.data.errors),
        );
        setLoad(false);
    }, [email, password, authContext, history]);

    return (
        <>
            <Header />
            {load && <Spiner />}

            {!load && (
                <div className="container d-flex justify-content-center">
                    <form
                        className="form-signin page"
                        onSubmit={(e) => {
                            e.preventDefault();
                            doLogin();
                        }}>
                        <img className="mb-4" src={favicon} alt="" width="72" height="72" />
                        <h1 className="h3 mb-3 font-weight-normal">{t('title:signin_title')}</h1>
                        <label htmlFor="inputEmail" className="sr-only">
                            {t('common:email')}
                        </label>
                        <input
                            type="email"
                            id="inputEmail"
                            className="form-control"
                            placeholder={t('common:email')}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        {errors.email && <p className="text-danger">{errors.email}</p>}
                        <label htmlFor="inputPassword" className="sr-only">
                            {t('common:password')}
                        </label>
                        <input
                            type="password"
                            id="inputPassword"
                            className="form-control"
                            placeholder={t('common:password')}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {errors.password && <p className="text-danger">{errors.password}</p>}
                        {errors.unauthorized && (
                            <p className="text-danger">Incorrect email or password</p>
                        )}
                        <button
                            className="btn btn-md btn-secondary btn-block mt-3 mr-0"
                            type="submit">
                            {t('common:signin')}
                        </button>
                        <span className="href mt-3" onClick={() => (window.location = OAUTH_URL)}>
                            {t('common:via_google')}
                        </span>
                        <p className="mt-5 mb-3 text-muted">&copy; 2020-2021</p>
                    </form>
                </div>
            )}
        </>
    );
};

export default SignIn;
