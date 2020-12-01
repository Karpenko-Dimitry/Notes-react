import React, { useContext, useState } from 'react';

import UsersService from '../../services/UsersService';
import { store } from '../../contexts/AuthContext';
import { OAUTH_URL } from '../../env';
import favicon from '../images/note.png';

import Header from '../elements/Header';

const SignUp = () => {
    const [_name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConf, setPasswordConf] = useState('');
    const [error, setError] = useState(false);
    const authContext = useContext(store);

    const doSubmit = () => {
        UsersService.store({
            name: _name,
            email,
            password,
            password_confirmation: passwordConf,
        })
            .then((res) => {
                authContext.signIn(res.data.access_token);
                document.location = '/';
            })
            .catch((res) => setError(res.data.errors));
    };

    return (
        <>
            <Header />
            <div className="container d-flex justify-content-center">
                <form
                    className="form-signin"
                    onSubmit={(e) => {
                        e.preventDefault();
                        doSubmit();
                    }}>
                    <img className="mb-4" src={favicon} alt="" width="72" height="72" />
                    <h1 className="h3 mb-3 font-weight-normal">Please sign up</h1>
                    <input
                        type="text"
                        className="form-control"
                        id="inputName"
                        name="name"
                        placeholder="name"
                        value={_name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    {(error.name || []).map((error) => (
                        <p key={error} className="text-danger">
                            {error}
                        </p>
                    ))}

                    <input
                        type="email"
                        className="form-control"
                        id="inputEmail"
                        name="email"
                        placeholder="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    {(error.email || []).map((error) => (
                        <p key={error} className="text-danger">
                            {error}
                        </p>
                    ))}

                    <input
                        type="password"
                        className="form-control mt-3"
                        id="inputPassword"
                        name="password"
                        placeholder="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {(error.password || []).map((error) => (
                        <p key={error} className="text-danger">
                            {error}
                        </p>
                    ))}

                    <input
                        type="password"
                        className="form-control"
                        id="inputPassword4"
                        name="password_confirmation"
                        placeholder="confirm"
                        value={passwordConf}
                        onChange={(e) => setPasswordConf(e.target.value)}
                    />

                    <button className="btn btn-md btn-secondary btn-block mt-3 mr-0" type="submit">
                        Sign up
                    </button>
                    <span className="href mt-3" onClick={() => (document.location = OAUTH_URL)}>
                        via Google
                    </span>
                    <p className="mt-5 mb-3 text-muted">&copy; 2020-2021</p>
                </form>
            </div>
        </>
    );
};

export default SignUp;
