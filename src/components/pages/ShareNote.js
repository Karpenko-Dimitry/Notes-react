import React, { useContext, useEffect, useState } from 'react';
import { useParams, Link, useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import NotesService from '../../services/NotesService';
import AuthService from '../../services/AuthService';

import Header from '../elements/Header';
import Spiner from '../elements/Spiner';

import { LocaleContext } from '../../contexts/LocaleContext';

const ShareNote = () => {
    const currentLocale = useContext(LocaleContext);
    const { t } = useTranslation(['common', 'title']);
    const { uid } = useParams();
    const history = useHistory();
    const [error, setError] = useState(false);
    const [message, setMessage] = useState(false);
    const [load, setLoad] = useState(true);
    const [email, setEmail] = useState('');
    const [note, setNote] = useState(null);
    const [authUserId, setAuthUserId] = useState(null);

    useEffect(() => {
        if (authUserId) {
            NotesService.read(uid, {}, { locale: currentLocale.get() }).then(
                (res) => {
                    const data = res.data.data;
                    if (authUserId !== data.user_id) {
                        return history.push('/notes/' + uid);
                    }
                    setNote(data);
                },
                (res) => setError(res.data.message),
            );
        }
        setLoad(false);
    }, [uid, authUserId, history, currentLocale]);

    useEffect(() => {
        AuthService.profile().then((res) => {
            setAuthUserId(res.data.data.id);
        });
    }, [uid]);

    const doShare = () => {
        NotesService.share(uid, email).then(
            (res) => {
                setMessage(true);
                setError(false);
                setEmail('');
            },
            (res) => {
                setError(res.data.errors);
                setMessage(false);
            },
        );
    };

    return (
        <>
            <Header />
            {load && <Spiner />}
            {note && (
                <div className="container">
                    <div className="col-md-8 blog-main">
                        <h3 className="pb-4 mb-4 font-italic border-bottom">
                            {t('title:share_note', { note: note.title })}
                        </h3>
                    </div>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            doShare();
                        }}>
                        <div className="form-row">
                            <div className="form-group col-md-6">
                                <input
                                    type="email"
                                    className="form-control"
                                    id="inputEmail4"
                                    name="email"
                                    value={email}
                                    placeholder={t('common:email')}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                {(error.email || []).map((error) => (
                                    <div key={error} className="text-danger">
                                        {error}
                                    </div>
                                ))}
                                {message && (
                                    <div key={error} className="text-success">
                                        {t('common:share_message')}
                                    </div>
                                )}
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary">
                            {t('common:send')}
                        </button>
                        <Link href={`/users/${authUserId}/notes`}>{t('common:back')}</Link>
                    </form>
                </div>
            )}
        </>
    );
};

export default ShareNote;
