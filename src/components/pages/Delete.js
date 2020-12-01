import React, { useEffect, useState } from 'react';
import { useParams, Link, useHistory } from 'react-router-dom';

import AuthService from '../../services/AuthService';
import NotesService from '../../services/NotesService';

import Header from '../elements/Header';
import SideBar from '../elements/SideBar';
import Spiner from '../elements/Spiner';

const Delete = () => {
    const { uid } = useParams();
    const history = useHistory();
    const [note, setNote] = useState(false);
    const [authUser, setAuthUser] = useState(null);

    useEffect(() => {
        if (authUser) {
            NotesService.read(uid).then((res) => {
                if (authUser.id !== res.data.data.user_id) {
                    return history.push(`/notes/${uid}`);
                }
                setNote(res.data.data);
            });
        }
    }, [authUser, uid, history]);
    useEffect(() => {
        AuthService.profile().then((res) => setAuthUser(res.data.data));
    }, [uid]);

    const doDelete = () => {
        NotesService.delete(uid).then(() => history.push(`/users/${authUser.id}/notes`));
    };

    return (
        <>
            <Header />
            <main role="main" className="container">
                <div className="row">
                    {!note && <Spiner />}
                    {note && (
                        <div className="col-md-8 blog-main">
                            <h3>
                                Do you realy want to delete note <br /> "{note.title}"
                            </h3>
                            <form
                                onClick={(e) => {
                                    e.preventDefault();
                                    doDelete();
                                }}>
                                <div className="d-flex justify-content-center mt-3">
                                    <button type="submit" className="btn btn-secondary btn-md mr-3">
                                        Yes
                                    </button>
                                    <Link
                                        to={`/notes/${uid}`}
                                        className="btn btn-secondary btn-md ">
                                        No
                                    </Link>
                                </div>
                            </form>
                        </div>
                    )}
                    <SideBar />
                </div>
            </main>
        </>
    );
};

export default Delete;
