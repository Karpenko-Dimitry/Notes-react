import React from 'react';

import '../css/pagination.scss';

import NoteItem from './NoteItem';

const NotesList = ({ header, notes, children }) => {
    const notesElement = notes.data.map((item) => {
        return <NoteItem key={item.uid} note={item} />;
    });

    return (
        <div className="col-lg-8 blog-main">
            <h2 className="pb-4 mb-4 font-italic border-bottom">{header}</h2>
            {notes.data.length < 1 ? (''
            ) : (
                <>
                    <div className="container">
                        <div className="row">
                            {notesElement}
                            {children}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default NotesList;
