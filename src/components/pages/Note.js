import React, { useContext, useEffect, useState } from 'react';
import FileSaver from 'file-saver';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { API_URL } from '../../env';

import AuthService from '../../services/AuthService';
import NotesService from '../../services/NotesService';
import { LocaleContext } from '../../contexts/LocaleContext';

import Header from '../elements/Header';
import Spiner from '../elements/Spiner';
import Error from '../elements/Error';

const Note = () => {
    const { t } = useTranslation(['title']);
    const currentLocale = useContext(LocaleContext);
    const { uid } = useParams();
    const [note, setNote] = useState(null);
    const [error, setError] = useState(false);
    const [load, setLoad] = useState(true);
    const [ability, setAbility] = useState(false);

    useEffect(() => {
        NotesService.read(uid, {}, { locale: currentLocale.get() }).then(
            (res) => setNote(res.data.data),
            (res) => setError(res.data.message),
        );

        setLoad(false);
    }, [uid, currentLocale]);

    useEffect(() => {
        AuthService.profile().then((res) => {
            if (note && note.user.id === res.data.data.id) {
                setAbility(true);
            }
        });
    }, [note]);

    const doDownLoad = (path) => {
        FileSaver.saveAs(API_URL + path, 'file' + path.match(/\..+$/));
    };

    return (
        <>
            <Header />
            <main role="main" className="container">
                <div className="row">
                    {error && <Error message={error || undefined} />}
                    {load && <Spiner />}
                    {note && (
                        <div className="col-md-12 blog-main">
                            <div className="blog-post">
                                <h2 className="blog-post-title">
                                    {note.title}
                                    {note.public === 0 && (
                                        <sup className="private-label">
                                            ({t('common:private_label')})
                                        </sup>
                                    )}
                                </h2>
                                <p className="blog-post-meta">
                                    {t('common:created_at')} {note.created_at_locale} <br />{' '}
                                    {t('common:by')} {note.user.name}
                                    {ability && (
                                        <>
                                            <Link to={`/notes/${uid}/share`}>
                                                <span> {t('common:share')},</span>
                                            </Link>
                                            <Link to={`/notes/${uid}/edit`}>
                                                <span> {t('common:edit')}, </span>
                                            </Link>
                                            <Link to={`/notes/${uid}/delete`}>
                                                <span> {t('common:delete')}, </span>
                                            </Link>
                                        </>
                                    )}
                                </p>
                                <p>
                                    {t('common:category_short')}
                                    {(note.categories || []).map((category) => (
                                        <span key={category.id}> {category.name}</span>
                                    ))}
                                </p>
                                <p>{note.content}</p>
                                <p>
                                    {(note.tags || []).map((tag) => (
                                        <Link
                                            to={{
                                                pathname: '/',
                                                search: `?tag=${tag.name}`,
                                            }}>
                                            #{tag.name + '  '}
                                        </Link>
                                    ))}
                                </p>

                                {note.files.length > 0 && (
                                    <div className="dropdown">
                                        <button
                                            className="btn btn-secondary dropdown-toggle"
                                            type="button"
                                            id="dropdownMenuButton"
                                            data-toggle="dropdown"
                                            aria-haspopup="true"
                                            aria-expanded="false">
                                            {t('common:download')}
                                        </button>
                                        <div
                                            className="dropdown-menu"
                                            aria-labelledby="dropdownMenuButton">
                                            {note.files.map((file, key) => {
                                                return (
                                                    <div
                                                        className="dropdown-item"
                                                        key={file.path}
                                                        onClick={() => doDownLoad(file.path)}>
                                                        {t('common:download_file')} №{key + 1}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                <hr />
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </>
    );
};

export default Note;
