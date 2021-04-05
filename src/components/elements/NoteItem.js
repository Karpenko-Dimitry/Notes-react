import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

//Services and styles
import { FilterContext } from './NoteList';
import { useTranslation } from 'react-i18next';

const NoteItem = ({ note, grid, userId }) => {
    const { t } = useTranslation('common');
    const { rangeAction } = useContext(FilterContext);

    return (
        <div className={`col-md-${grid ? '12' : '6'}`}>
            <h2>
                {note.title}
                {note.public === 0 && (
                    <sup className="private-label">({t('common:private_label')})</sup>
                )}
            </h2>
            <p className="blog-post-meta">
                {t('common:created_at')} {note.created_at_locale} <br /> {t('common:by')}{' '}
                {note.user.name}
                {note.user.id === userId && (
                    <>
                        <Link to={`/notes/${note.uid}/share`}>
                            <span> {t('common:share')},</span>
                        </Link>
                        <Link to={`/notes/${note.uid}/edit`}>
                            <span> {t('common:edit')}, </span>
                        </Link>
                        <Link to={`/notes/${note.uid}/delete`}>
                            <span> {t('common:delete')}, </span>
                        </Link>
                    </>
                )}
            </p>
            <p>
                {t('common:category_short')}
                {(note.categories || []).map((category) => (
                    <span
                        key={category.id}
                        className="href"
                        onClick={() => rangeAction({ category: category.id, name: category.name })}>
                        {category.name}
                    </span>
                ))}
            </p>

            <p>{`${note.content.substr(0, 200)}...`}</p>
            <p>
                {(note.tags || []).map((tag) => (
                    <span
                        key={tag.id}
                        className="href"
                        onClick={() => rangeAction({ tag: tag.name })}>
                        #{tag.name + '  '}
                    </span>
                ))}
            </p>

            <p>
                <Link className="btn btn-secondary btn-sm" to={`/notes/${note.uid}`} role="button">
                    {t('common:details')} &raquo;
                </Link>
            </p>
            <hr />
        </div>
    );
};

export default NoteItem;
