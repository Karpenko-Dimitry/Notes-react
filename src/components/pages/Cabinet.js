import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import Header from '../elements/Header';
import Spiner from '../elements/Spiner';
import AuthService from '../../services/AuthService';
import UsersService from '../../services/UsersService';

const Cabinet = () => {
    const { t } = useTranslation(['common', 'title']);
    const [user, setUser] = useState([]);
    const [errors, setErrors] = useState(false);
    const [load, setLoad] = useState(true);

    useEffect(() => {
        AuthService.profile().then(
            (res) => setUser(res.data.data),
            (res) => setErrors(res.data.errors),
        );
        setLoad(false);
    }, []);

    const doUpload = (file) => {
        setLoad(true);

        let formData = new FormData();

        formData.append('user_file', file[0], file[0]['name']);

        UsersService.storeAvatar(user.id, formData).then(
            (res) => setUser(res.data.data),
            (res) => setErrors(res.data.errors),
        );
        setLoad(false);
    };

    return (
        <>
            <Header />
            <main role="main" className="container">
                <div className="row mr-0 ml-0">
                    {load && <Spiner />}
                    {user && (
                        <div className="col-md-12">
                            <div className="row g-0 border rounded overflow-hidden flex-md-row mb-4 shadow-sm h-md-250 position-relative justify-content-center">
                                <div className="col-auto d-lg-block">
                                    <div
                                        className="avatar-place bd-placeholder-img border"
                                        style={{
                                            backgroundImage: `url(${user.avatar})`,
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                        }}></div>
                                </div>
                                <div className="col p-4 d-flex flex-column position-static">
                                    <form>
                                        <input
                                            type="file"
                                            id="avatar-input"
                                            hidden
                                            onChange={(e) => doUpload(e.target.files)}
                                        />
                                        <strong className="d-inline-block mb-2 text-primary href">
                                            <label className="href mb-0" htmlFor="avatar-input">
                                                {t('common:change_avatar')}
                                            </label>
                                        </strong>
                                        {(errors.user_file || []).map((error) => (
                                            <p key={error} className="text-danger">
                                                {error}
                                            </p>
                                        ))}
                                    </form>
                                    <h3 className="mb-0">
                                        {t('title:cabinet', { user: user.name })}
                                    </h3>
                                    <div className="mb-1 text-muted">
                                        {t('common:created_at', { date: user.created_at })}
                                    </div>
                                    <p className="card-text mb-auto">
                                        {t('common:user_card_intro')}
                                    </p>
                                    <div className="d-flex justify-content-center mt-3">
                                        <Link to={`/`} className="btn btn-secondary btn-md ">
                                            {t('common:home')}
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </>
    );
};

export default Cabinet;
