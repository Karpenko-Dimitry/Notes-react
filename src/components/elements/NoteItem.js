import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthService from '../../services/AuthService';

//Services and styles
import '../css/note-item.css';
import { FilterContext } from './NoteList';

const NoteItem = ({ note, grid }) => {
    const { rangeAction } = useContext(FilterContext);
    const [_public, setPublic] = useState(false);
    const [ability, setAbility] = useState(false);

    useEffect(() => {
        AuthService.profile().then((res) => {
            if (note && note.user.id === res.data.data.id) {
                setAbility(true);
            }
        });
    }, [note]);

    useEffect(() => {
        if (note.public) {
            setPublic(true);
        }
    }, [note]);

    return (
        <div className={`col-md-${grid ? '12' : '6'}`}>
            <h2>
                {note.title}
                {_public || <sup className="private-label">(private)</sup>}
            </h2>
            <p className="blog-post-meta">
                Created at {note.created_at_locale} <br /> by {note.user.name}
                {ability && (
                    <>
                        <Link to={`/notes/${note.uid}/share`}>
                            <span> Share,</span>
                        </Link>
                        <Link to={`/notes/${note.uid}/edit`}>
                            <span> Edit, </span>
                        </Link>
                        <Link to={`/notes/${note.uid}/delete`}>
                            <span> Delete, </span>
                        </Link>
                    </>
                )}
            </p>
            <p>
                Cat.:
                {(note.categories || []).map((category) => (
                    
                    <span key={category.id} className="href" onClick={() => rangeAction({'category': category.id, name: category.name})}>{category.name}</span>
                        
                  
                ))}
            </p>

            <p>{`${note.content.substr(0, 200)}...`}</p>
            <p>
                <Link className="btn btn-secondary btn-sm" to={`/notes/${note.uid}`} role="button">
                    View details &raquo;
                </Link>
            </p>
            <hr />
        </div>
    );
};

export default NoteItem;
