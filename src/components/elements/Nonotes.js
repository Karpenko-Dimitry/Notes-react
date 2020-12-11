import React from 'react';
import { useTranslation } from 'react-i18next';

const NoNotes = () => {
    const { t } = useTranslation('title');
    return (
        <h2 className="col-8 pb-4 mb-4 font-italic border-bottom d-flex justify-content-center">
            {t('title:no_notes')}
        </h2>
    );
};

export default NoNotes;
