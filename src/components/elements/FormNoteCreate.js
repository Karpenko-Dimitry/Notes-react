import React from 'react';
import { Link } from 'react-router-dom';

const FormNoteCreate = () => {

    return (
        <div className="p-4 mb-3 bg-light rounded">
            <h4 className="font-italic">
                Add your note
                <Link to="/notes/create" className="ml-3">
                    <i className="fa fa-plus btn btn-secondary btn-sm"></i>
                </Link>
            </h4>
        </div>
    );
};

export default FormNoteCreate;
