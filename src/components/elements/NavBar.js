import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom';

import SearchPanel from './SearchPanel';

import { store } from '../../contexts/AuthContext';
import AuthService from '../../services/AuthService';
import { LOCALES } from '../../env';
import { LocaleContext } from '../../contexts/LocaleContext';
import { useTranslation } from 'react-i18next';

const NavBar = ({ callback }) => {
    const { t, i18n } = useTranslation('common');
    const history = useHistory();
    const { isSignedIn } = useContext(store);
    const [user, setUser] = useState(undefined);
    const locales = LOCALES.split(',');
    const currentLocale = useContext(LocaleContext);

    useEffect(() => {
        if (isSignedIn && !user) {
            AuthService.profile().then(
                (res) => setUser(res.data.data),
                (res) => {
                    if (res.status === 401) {
                        history.push('/sign-out');
                    }
                },
            );
        }
    }, [history, isSignedIn, user]);

    return (
        <div className="nav-scroller py-1 mb-2 nav-bar">
            <nav className="navbar navbar-expand navbar-dark bg-dark">
                <a className="navbar-brand" href="/">
                    ALL Notes
                </a>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-toggle="collapse"
                    data-target="#navbarsExample02"
                    aria-controls="navbarsExample02"
                    aria-expanded="false"
                    aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div
                    className="navbar collapse navbar-collapse justify-content-end"
                    id="navbarsExample02">
                    <ul className="navbar-nav">
                        <div className="dropdown mr-3">
                            <div
                                className="btn btn-secondary dropdown-toggle"
                                role="button"
                                id="dropdownMenuLink"
                                data-toggle="dropdown"
                                aria-haspopup="true"
                                aria-expanded="false">
                                {currentLocale.get()}
                            </div>
                            <div className="dropdown-menu" aria-labelledby="dropdownMenuLink">
                                {(locales || []).map((locale) => (
                                    <button
                                        key={locale}
                                        className="dropdown-item"
                                        onClick={() => {
                                            currentLocale.set(locale);
                                            i18n.changeLanguage(locale);
                                        }}>
                                        {t(`common:${locale}`)}
                                    </button>
                                ))}
                            </div>
                        </div>
                        {user && (
                            <li className="nav-item active">
                                <Link className="nav-link" to={`/users/${user.id}/notes`}>
                                    {user && user.name}
                                </Link>
                            </li>
                        )}

                        {isSignedIn && (
                            <li className="nav-item">
                                <Link className="nav-link" to="/sign-out">
                                    {t('common:logout')}
                                </Link>
                            </li>
                        )}

                        {!isSignedIn && (
                            <li className="nav-item">
                                <Link className="nav-link" to="/sign-up">
                                    {t('common:signup')}
                                </Link>
                            </li>
                        )}

                        {!isSignedIn && (
                            <li className="nav-item">
                                <Link className="nav-link" to="/sign-in">
                                    {t('common:signin')}
                                </Link>
                            </li>
                        )}
                    </ul>

                    <SearchPanel callback={callback} />
                </div>
            </nav>
        </div>
    );
};

export default NavBar;
