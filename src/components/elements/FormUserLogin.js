import React, { useContext, useState, useCallback } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { store } from '../../contexts/AuthContext';
import { OAUTH_URL } from '../../env';

import AuthService from '../../services/AuthService';

const FormUserLogin = () => {
    const { t } = useTranslation(['common', 'title']);
    const history = useHistory();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const authContext = useContext(store);

    const doLogin = useCallback(() => {
        AuthService.signIn(email, password).then(
            (res) => {
                authContext.signIn(res.data.access_token);
                history.go('/');
            },
            (res) => {
                setErrors(res.data.errors);
            },
        );
    }, [email, password, authContext, history]);

    return (
        <div className="p-4 mb-3 bg-light rounded">
            <h4 className="font-italic">{t('title:signin_title')}</h4>
            <form
                className="form-signin"
                onSubmit={(e) => {
                    e.preventDefault();
                    doLogin();
                }}>
                <div className="form-row">
                    <div className="form-group col-md-12">
                        <label htmlFor="inputEmail4">{t('common:email')}</label>
                        <input
                            type="email"
                            className="form-control"
                            id="inputEmail4"
                            name="email"
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                        />
                        {(errors.email || []).map((error) => (
                            <p key={error} className="text-danger">
                                {error}
                            </p>
                        ))}
                    </div>
                    <div className="form-group col-md-12">
                        <label htmlFor="inputPassword4">{t('common:password')}</label>
                        <input
                            type="password"
                            className="form-control"
                            id="inputPassword4"
                            name="password"
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                        />
                        {(errors.password || []).map((error) => (
                            <p key={error} className="text-danger">
                                {error}
                            </p>
                        ))}
                        {errors.unauthorized && (
                            <p className="text-danger">Incorrect email or password</p>
                        )}
                        <button type="submit" className="btn btn-secondary  btn-sm mt-3 mr-1">
                            {t('common:signin')}
                        </button>
                        <Link to="/sign-up" className="btn btn-secondary  btn-sm mt-3 mr-1">
                            {t('common:signup')}
                        </Link>
                        <div
                            className="btn btn-primary btn-sm mt-3"
                            onClick={() => (window.location = OAUTH_URL)}>
                            {t('common:via_google')}
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default FormUserLogin;
