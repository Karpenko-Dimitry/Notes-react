import React, { useEffect, useReducer, useState } from 'react';
import { useParams } from 'react-router-dom';

import Header from '../elements/Header';
import NotesList from '../elements/NotesList';
import Spiner from '../elements/Spiner';
import SideBar from '../elements/SideBar';
import Error from '../elements/Error';
import ApiPaginator from '../elements/ApiPaginator';

import NoteService from '../../services/NotesService';

const UserNotes = () => {
    let { id } = useParams();
    const [error, setError] = useState(false);
    const [notes, setNotes] = useState(false);
    const [loading, setLoading] = useState(true);
    const [header] = useState("User's notes");
    const [filter, setFilter] = useReducer(
        (prev, data) => {
            return {
                ...prev,
                ...data,
            };
        },
        {
            per_page: 5,
            shared: 0,
        },
    );

    useEffect(() => {
        NoteService.list(id, filter).then(
            (res) => {
                setLoading(false);
                setNotes(res.data);
            },
            (res) => {
                setLoading(false);
                setError(res.data.message);
            },
        );
    }, [id, filter]);

    return (
        <>
            <Header />
            <main role="main" className="container">
                <div className="row">
                    {error && <Error message={error || undefined} />}
                    {loading && <Spiner />}
                    {notes && (
                        <NotesList header={header} notes={notes}>
                            <ApiPaginator
                                meta={notes.meta}
                                filters={filter}
                                countButtons={5}
                                onPageChange={(e) => setFilter(e.query)}
                                doRangeOwn={(e) => setFilter({ shared: e.target.value })}
                                doRangePerPage={(e) => setFilter({ per_page: e.target.value })}
                            />
                        </NotesList>
                    )}
                    <SideBar />
                </div>
            </main>
        </>
    );
};

export default UserNotes;
