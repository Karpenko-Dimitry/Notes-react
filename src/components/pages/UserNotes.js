import React, { useEffect, createContext, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import NoteList from '../elements/NoteList';
import NoteService from '../../services/NotesService';
import ApiPaginator from '../elements/ApiPaginator';
import { LocaleContext } from '../../contexts/LocaleContext';

export const RangeContext = createContext();

const UserNotes = () => {
    const { t } = useTranslation(['title']);
    let { id } = useParams();
    const currentLocale = useContext(LocaleContext);
    const [selectedCategories, setSelectedCategories] = useState();
    const [error, setError] = useState(false);
    const [notes, setNotes] = useState(false);
    const [loading, setLoading] = useState(true);
    const [header] = useState(t('title:user_notes_title'));
    const [filter, setFilter] = useState({
        per_page: 5,
        shared: 0,
    });

    useEffect(() => {
        NoteService.list(id, filter, { locale: currentLocale.get() }).then(
            (res) => {
                setLoading(false);
                setNotes(res.data);
            },
            (res) => {
                setLoading(false);
                setError(res.data.message);
            },
        );
    }, [id, filter, currentLocale]);

    const rangeAction = (range) => {
        setFilter((prev) => ({ ...prev, ...range }));
    };

    const rangeCategories = (target) => {
        if (target.checked) {
            setSelectedCategories((prev) => {
                return { ...{ [target.value]: target.value }, ...prev };
            });
        } else {
            setSelectedCategories((prev) => {
                let newState = { ...prev };
                delete newState[target.value];
                return newState;
            });
        }
    };

    useEffect(() => {
        if (selectedCategories) {
            setFilter((prev) => ({
                ...prev,
                ...{ category: Object.keys(selectedCategories).join(',') },
            }));
        }
    }, [selectedCategories]);

    return (
        <>
            <NoteList
                sharedFilter
                notes={notes}
                rangeAction={rangeAction}
                rangeCategories={rangeCategories}
                title={header}
                error={error}
                loading={loading}>
                <ApiPaginator
                    meta={notes.meta}
                    filters={filter}
                    countButtons={5}
                    onPageChange={(e) => setFilter(e.query)}
                    doRangeOwn={false}
                    doRangePerPage={(e) => setFilter({ per_page: e.target.value })}
                />
            </NoteList>
        </>
    );
};

export default UserNotes;
