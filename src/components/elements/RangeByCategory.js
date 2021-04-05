import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CategoriesService from '../../services/CategoriesService';
import { LocaleContext } from '../../contexts/LocaleContext';

import { FilterContext } from './NoteList';

const RangeByCategory = ({ calback }) => {
    const currentLocale = useContext(LocaleContext);
    const { t } = useTranslation(['title', 'common']);
    const { rangeCategories } = useContext(FilterContext);
    const [categories, setCategories] = useState();

    useEffect(() => {
        CategoriesService.list(null, {}, { locale: currentLocale.get() }).then((res) =>
            setCategories(res.data.data),
        );
    }, [currentLocale]);

    return (
        <div className="p-4 mb-3 bg-light rounded">
            <h4 className="font-italic">{t('title:range_title')}</h4>

            <form className="d-flex flex-wrap category-range">
                {(categories || []).map((category) => (
                    <div key={category.id} className="w-30 mr-3">
                        <input
                            type="checkbox"
                            name="category[]"
                            className="category-checkbox mr-1"
                            id={`category${category.id}`}
                            value={category.id}
                            onChange={(e) => rangeCategories(e.target)}
                        />
                        <label htmlFor={`category${category.id}`}>{category.name}</label>
                    </div>
                ))}
            </form>
        </div>
    );
};

export default RangeByCategory;
