import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const FormNoteCreate = () => {
    const { t } = useTranslation('title');
    return (
        <>
            <div className="p-4 mb-3 bg-light rounded">
                <h4 className="font-italic">
                    <Link to="/cabinet" className="ml-0">
                        <i className="fas fa-home btn btn-secondary btn-sm"></i>
                    </Link>
                    {t('title:cabinet')}
                </h4>
            </div>
            <div className="p-4 mb-3 bg-light rounded">
                <h4 className="font-italic">
                    {t('title:add_title')}
                    <Link to="/notes/create" className="ml-3">
                        <i className="fa fa-plus btn btn-secondary btn-sm"></i>
                    </Link>
                </h4>
            </div>
        </>
    );
};

export default FormNoteCreate;
