import React, { useContext } from 'react';

import { FilterContext } from './NoteList';

const NotesRange = ({ callback, grid, sharedFilter }) => {
    const { rangeAction } = useContext(FilterContext);

    return (
        <div className="col-md-5 d-flex flex-row justify-content-end">
            <form className="per-page-form form-row justify-content-between align-items-end">
                <div className="form-group w-30 ml-3 mb-0">
                    <label htmlFor="grid-notes">
                        {grid ? (
                            <i className="fa fa-th-large" aria-hidden="true"></i>
                        ) : (
                            <i className="fa fa-list" aria-hidden="true"></i>
                        )}
                    </label>
                    <input
                        type="checkbox"
                        name="grid_notes"
                        className="grid-notes"
                        id="grid-notes"
                        onChange={(e) => callback(e.target.checked)}
                        hidden
                    />
                </div>
                <div className="form-group w-30 ml-3">
                    <label htmlFor="per-page-select">Per page</label>
                    <select
                        name="per_page"
                        className="form-control per-page-select"
                        onChange={(e) => rangeAction({ per_page: e.target.value })}>
                        <option value="5">5</option>
                        <option value="10">10</option>
                    </select>
                </div>
                {sharedFilter && (
                    <div className="form-group w-30 ml-3">
                        <label htmlFor="range-share">Shared</label>
                        <select
                            name="shared"
                            className="form-control range-shared"
                            id="range-share"
                            onChange={(e) => rangeAction({ shared: e.target.value })}>
                            <option value="0">All</option>
                            <option value="1">Shared</option>
                        </select>
                    </div>
                )}
            </form>
        </div>
    );
};

export default NotesRange;
