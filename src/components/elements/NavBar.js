import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom';

import SearchPanel from './SearchPanel';

import { store } from '../../contexts/AuthContext';
import AuthService from '../../services/AuthService';

const NavBar = ({ callback }) => {
    const history = useHistory();
    const authContext = useContext(store);
    const [auth] = useState(authContext.isSignedIn());
    const [user, setUser] = useState(undefined);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (authContext.isSignedIn() && !user) {
            AuthService.profile().then(
                (res) => setUser(res.data.data),
                (res) => {
                    if (res.status === 401) {
                        history.push('/sign-out');
                    }
                    setError(res.data.message);
                    console.log(error);
                },
            );
        }
    }, [history, authContext, user, error]);

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
                        {user && (
                            <li className="nav-item active">
                                <Link className="nav-link" to={`/users/${user.id}/notes`}>
                                    {user && user.name}
                                </Link>
                            </li>
                        )}

                        {auth && (
                            <li className="nav-item">
                                <Link className="nav-link" to="/sign-out">
                                    Log-out
                                </Link>
                            </li>
                        )}

                        {!auth && (
                            <li className="nav-item">
                                <Link className="nav-link" to="/sign-up">
                                    Sign-up
                                </Link>
                            </li>
                        )}

                        {!auth && (
                            <li className="nav-item">
                                <Link className="nav-link" to="/sign-in">
                                    Sign-in
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