import React, { createContext, useState, useEffect } from 'react';

import Header from './Header';
import SideBar from './SideBar';
import Error from './Error';
import Nonotes from './Nonotes';
import NoteItem from './NoteItem';
import NotesRange from './NotesRange';
import Spiner from './Spiner';
import '../css/pagination.scss';
import AuthService from '../../services/AuthService';

export const FilterContext = createContext();

const NoteList = ({
    error,
    loading,
    children,
    notes,
    rangeAction,
    searchNotes,
    rangeCategories,
    title,
    sharedFilter = false,
}) => {
    const [listGrid, setListGrid] = useState(false);
    const changeGrid = (e) => {
        setListGrid(e);
    };
    const [userId, setUserId] = useState();

    useEffect(() => {
        AuthService.profile().then((res) => {
            setUserId(res.data.data.id);
        });
    }, []);

    return (
        <>
            <FilterContext.Provider value={{ rangeAction, searchNotes, rangeCategories }}>
                <Header />

                <main role="main" className="container">
                    <div className="row">
                        {error && <Error />}
                        {loading && <Spiner />}
                        {notes.data && (
                            <div className="col-lg-8 blog-main">
                                <div className="container">
                                    <div className="row border-bottom mb-1 pb-1">
                                        <h3 className="col-md-7 font-italic mb-0">{title}</h3>
                                        <NotesRange
                                            grid={listGrid}
                                            sharedFilter={sharedFilter}
                                            callback={changeGrid}
                                        />
                                    </div>
                                </div>
                                {notes.data.length < 1 ? (
                                    <Nonotes />
                                ) : (
                                    <>
                                        <div className="container">
                                            <div className="row">
                                                {(notes.data || []).map((item) => {
                                                    return (
                                                        <NoteItem
                                                            key={item.uid}
                                                            note={item}
                                                            grid={listGrid}
                                                            userId={userId}
                                                        />
                                                    );
                                                })}
                                                {children}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                        <SideBar />
                    </div>
                </main>
            </FilterContext.Provider>
        </>
    );
};

export default NoteList;
