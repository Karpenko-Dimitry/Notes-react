import React, { useEffect, useState } from 'react';
import FileSaver from 'file-saver';
import { Link, useParams } from 'react-router-dom';

import { API_URL } from '../../env';

import AuthService from '../../services/AuthService';
import NotesService from '../../services/NotesService';

import Header from '../elements/Header';
import Spiner from '../elements/Spiner';
import SideBar from '../elements/SideBar';
import Error from '../elements/Error';

const Note = () => {
    const { uid } = useParams();
    const [note, setNote] = useState(null);
    const [error, setError] = useState(false);
    const [load, setLoad] = useState(true);
    const [ability, setAbility] = useState(false);

    useEffect(() => {
        NotesService.read(uid).then(
            (res) => setNote(res.data.data),
            (res) => setError(res.data.message),
        );

        setLoad(false);
    }, [uid]);

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
                        <div className="col-md-8 blog-main">
                            <div className="blog-post">
                                <h2 className="blog-post-title">{note.title}</h2>
                                <p className="blog-post-meta">
                                    Created at {note.created_at_locale} <br /> by {note.user.name}
                                    {ability && (
                                        <>
                                            <Link to={`/notes/${uid}/share`}>
                                                <span> Share,</span>
                                            </Link>
                                            <Link to={`/notes/${uid}/edit`}>
                                                <span> Edit, </span>
                                            </Link>
                                            <Link to={`/notes/${uid}/delete`}>
                                                <span> Delete, </span>
                                            </Link>
                                        </>
                                    )}
                                </p>
                                <p>{note.content}</p>

                                {note.files.length > 0 && (
                                    <div className="dropdown">
                                        <button
                                            className="btn btn-secondary dropdown-toggle"
                                            type="button"
                                            id="dropdownMenuButton"
                                            data-toggle="dropdown"
                                            aria-haspopup="true"
                                            aria-expanded="false">
                                            Download
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
                                                        File №{key + 1}
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
                    <SideBar />
                </div>
            </main>
        </>
    );
};

export default Note;
