import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

//Services and styles
import '../css/note-item.css';

const NoteItem = (data) => {
    const [_public, setPublic] = useState(false);

    useEffect(() => {
        if (data.note.public) {
            setPublic(true);
        }
    }, [data.note]);

    return (
        <div className="col-md-6">
            <h2>
                {data.note.title}
                {_public || <sup className="private-label">(private)</sup>}
            </h2>
            <p className="blog-post-meta">
                Created at {data.note.created_at_locale} <br /> by {data.note.user.name}{' '}
            </p>
            <p>{`${data.note.content.substr(0, 200)}...`}</p>
            <p>
                <Link
                    className="btn btn-secondary btn-sm"
                    to={`/notes/${data.note.uid}`}
                    role="button">
                    View details &raquo;
                </Link>
            </p>
            <hr />
        </div>
    );
};

export default NoteItem;
