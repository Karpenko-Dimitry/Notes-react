import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { FilterContext } from './NoteList';
import { useTranslation } from 'react-i18next';

let timeout;

const SearchPanel = () => {
    const { t } = useTranslation('common');
    const { searchNotes } = useContext(FilterContext) || false;
    const history = useHistory();
    const [state, setState] = useState('');

    const doSearch = (event) => {
        const { value } = event.target;

        setState(value);

        if (searchNotes) {
            clearTimeout(timeout);

            timeout = setTimeout(() => {
                searchNotes(value);
            }, 300);
        } else {
            timeout = setTimeout(() => {
                history.push({
                    pathname: '/',
                    search: `?query=${value}`,
                });
            }, 1000);
        }
    };

    useEffect(() => {
        clearTimeout(timeout);
    }, []);

    return (
        <div className="form-inline my-2 my-md-0 d-flex justify-content-center">
            <button type="submit" className="nav-link nav-btn">
                {t('common:search')}
            </button>
            <input
                className="form-control"
                type="text"
                name="query"
                onChange={doSearch}
                value={state}
            />
        </div>
    );
};

export default SearchPanel;
