import React, { useEffect, useReducer, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';

import AuthService from '../../services/AuthService';

import Header from '../elements/Header';
import Spiner from '../elements/Spiner';
import Error from '../elements/Error';
import NoteService from '../../services/NotesService';

const Edit = () => {
    const history = useHistory();
    const { uid } = useParams();
    const [note, setNote] = useReducer((prev, data) => {
        return {
            ...prev,
            ...data,
        };
    }, null);
    const [authUser, setAuthUser] = useState(null);
    const [error, setError] = useState(false);
    const [load, setLoad] = useState(true);

    useEffect(() => {
        if (authUser) {
            NoteService.read(uid).then(
                (res) => {
                    const data = res.data.data;

                    if (authUser.id !== data.user_id) {
                        return history.push('/notes/' + uid);
                    }
                    setNote(data);
                    setLoad(false);
                },
                (res) => {
                    setLoad(false);
                    setError(res.data.message);
                },
            );
        }
    }, [uid, authUser, history]);

    useEffect(() => {
        AuthService.profile().then((res) => setAuthUser(res.data.data));
    }, [uid]);

    const doEdit = () => {
        NoteService.update(uid, {
            title: note.title,
            content: note.content,
            public: note.public,
        }).then(
            (response) => {
                history.push(`/notes/${uid}`);
            },
            (response) => {
                setError(response.data.message);
            },
        );
    };

    return (
        <>
            <Header />
            <div className="container">
                {load && <Spiner />}
                {error && <Error message={error || undefined} />}
                {note && (
                    <div className="container">
                        <h2>Edit note</h2>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                doEdit();
                            }}>
                            <div className="input-group mb-3 mt-3">
                                <div className="input-group-prepend">
                                    <span className="input-group-text" id="basic-addon1">
                                        Title
                                    </span>
                                </div>
                                <input
                                    type="text"
                                    className="form-control"
                                    aria-label="Username"
                                    aria-describedby="basic-addon1"
                                    name="title"
                                    value={note.title}
                                    onChange={(e) => setNote({ title: e.target.value })}
                                />
                            </div>
                            <div className="input-group">
                                <div className="input-group-prepend">
                                    <span className="input-group-text">Text</span>
                                </div>
                                <textarea
                                    className="form-control"
                                    rows="10"
                                    aria-label="With textarea"
                                    name="content"
                                    onChange={(e) => setNote({ content: e.target.value })}
                                    value={note.content}
                                />
                            </div>
                            <div className="form-group form-check mt-3">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="exampleCheck1"
                                    name="public"
                                    onChange={() => setNote({ public: !note.public })}
                                    checked={note.public}
                                />
                                <label className="form-check-label " htmlFor="exampleCheck1">
                                    Make public
                                </label>
                            </div>
                            <div className="d-flex justify-content-center mt-3">
                                <button type="submit" className="btn btn-secondary btn-lg ">
                                    Edit note
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </>
    );
};

export default Edit;
