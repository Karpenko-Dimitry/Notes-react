import React, { createContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import NoteService from '../../services/NotesService';

import Header from '../elements/Header';
import NotesList from '../elements/NotesList';
import Spiner from '../elements/Spiner';
import SideBar from '../elements/SideBar';
import Error from '../elements/Error';
import ApiPaginator from '../elements/ApiPaginator';
import Nonotes from '../elements/Nonotes';

export const SearchContext = createContext();

const Home = () => {
    const location = useLocation();
    const [notes, setNotes] = useState([]);
    const [load, setLoad] = useState(true);
    const [error, setError] = useState(false);
    const [header, setHeader] = useState('Public notes are available.');
    const [filter, setFilter] = useState({
        per_page: 5,
        query: location.search ? location.search.match(/query=([^&]+)/)[1] : '',
    });

    useEffect(() => {
        NoteService.list(null, filter).then(
            (res) => setNotes(res.data),
            (res) => setError(res.data.message),
        );
        setLoad(false);
    }, [filter]);

    const searchNotes = (query) => {
        setFilter((prev) => {
            return {
                ...prev,
                query,
            };
        });

        setHeader('Search result');
    };

    return (
        <>
            <SearchContext.Provider value={searchNotes}>
                <Header />
            </SearchContext.Provider>

            <main role="main" className="container">
                <div className="row">
                    {error && <Error />}
                    {load && <Spiner />}
                    {notes.data && (
                        <NotesList header={header} notes={notes}>
                            <ApiPaginator
                                meta={notes.meta}
                                filters={filter}
                                countButtons={5}
                                onPageChange={(e) => setFilter(e.query)}
                                doRangeOwn={false}
                                doRangePerPage={(e) => setFilter({ per_page: e.target.value })}
                            />
                        </NotesList>
                    )}
                    {notes.length === 0 && <Nonotes />}
                    <SideBar />
                </div>
            </main>
        </>
    );
};

export default Home;
