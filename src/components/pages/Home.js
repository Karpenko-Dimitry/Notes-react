import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { LocaleContext } from '../../contexts/LocaleContext';

import NoteService from '../../services/NotesService';

import ApiPaginator from '../elements/ApiPaginator';
import NoteList from '../elements/NoteList';

export const SearchContext = createContext();

const Home = () => {
    const currentLocale = useContext(LocaleContext);
    const location = useLocation();
    const [notes, setNotes] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState();
    const [load, setLoad] = useState(true);
    const [error, setError] = useState(false);
    const [header, setHeader] = useState('Public notes are available.');
    const [filter, setFilter] = useState({
        per_page: 5,
        shared: 0,
        query: location.search ? location.search.match(/query=([^&]+)/)[1] : '',
    });

    useEffect(() => {

        NoteService.list(null, filter, {locale: currentLocale.get()}).then(
            (res) => {
                setNotes(res.data);
                console.log(res);
            },
            (res) => setError(res.data.message),
        );
        setLoad(false);
    }, [filter, currentLocale]);

    const searchNotes = (query) => {
        setFilter((prev) => {
            return {
                ...prev,
                query,
            };
        });

        setHeader('Search result');
    };

    const rangeAction = (range) => {
        if(range.category) {
            setHeader('Public notes by category ' + range.name);
        }
        setFilter((prev) => ({ ...prev, ...range }));
    };
    

    const rangeCategories = (target) => {
        if (target.checked) {
            setSelectedCategories((prev) => {
                return { ...{ [target.value]: target.value }, ...prev };
            });
        } else {
            setSelectedCategories((prev) => {
                let newState = {...prev};
                delete newState[target.value]
                return newState;
            });
        }

    };

    useEffect(() => {
        if(selectedCategories) {
            console.log(selectedCategories);
            setFilter((prev) => ({...prev, ...{'category': Object.keys(selectedCategories).join(',')}}));
        }
        
    },[selectedCategories]);

    console.log(filter);

    return (
        <NoteList
            notes={notes}
            searchNotes={searchNotes}
            rangeAction={rangeAction}
            rangeCategories={rangeCategories}
            title={header}
            error={error}
            loading={load}>
            <ApiPaginator
                meta={notes.meta}
                filters={filter}
                countButtons={5}
                onPageChange={(e) => setFilter(e.query)}
                doRangeOwn={false}
                doRangePerPage={(e) => setFilter({ per_page: e.target.value })}
            />
        </NoteList>
    );
};

export default Home;
