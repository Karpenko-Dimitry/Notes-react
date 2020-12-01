import React, { useCallback, useEffect, useState } from 'react';

function Paginator({ meta, filters, countButtons, onPageChange, doRangeOwn, doRangePerPage }) {
    const [pages, setPages] = useState([]);
    const getPages = useCallback((meta, countButtons = 5) => {
        let fromPage = Math.max(1, meta.current_page - Math.round(countButtons / 2 - 1));
        let pages = [];

        if (countButtons > meta.last_page - fromPage) {
            fromPage = Math.max(1, meta.last_page - countButtons + 1);
        }

        while (pages.length < countButtons && fromPage <= meta.last_page) {
            pages.push(fromPage++);
        }

        return pages;
    }, []);

    const setPage = useCallback(
        (page) => {
            let query = {};

            if (typeof filters == 'object' && filters) {
                query = {
                    ...query,
                    ...filters,
                    ...{
                        page: page,
                    },
                };
            }

            if (onPageChange) {
                return onPageChange({
                    query: query,
                });
            }
        },
        [filters, onPageChange],
    );

    useEffect(() => {
        setPages(getPages(meta, countButtons));

        if (meta.last_page < meta.current_page) {
            setPage(1);
        }
    }, [meta, countButtons, getPages, setPage]);

    return (
        <div className="pagination">
            {/* <div className="pagination-overview">
                {meta.total > 0
                    ? (meta.from !== meta.to ? meta.from + '-' + meta.to : meta.from) +
                      ' from ' +
                      meta.total
                    : 'No results'}
            </div> */}
            <div className="col-md-2">
                <label htmlFor="">Per page</label>
                <select id="inputState" className="form-control" onChange={doRangePerPage}>
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="15">15</option>
                    <option value="20">20</option>
                </select>
            </div>
            {doRangeOwn && (
                <div className="col-md-2">
                    <select id="inputState" className="form-control range-shared" onChange={doRangeOwn}>
                        <option value="0">All</option>
                        <option value="1">Shared</option>
                    </select>
                </div>
            )}
            <div className="pagination-list">
                <div
                    onClick={() => setPage(1)}
                    className={'pagination-item ' + (meta.current_page === 1 ? 'disabled' : '')}>
                    <em className="mdi mdi-chevron-left">&#171;</em>
                </div>
                {pages.map((page, key) => (
                    <div
                        key={key}
                        onClick={() => setPage(page)}
                        className={
                            'pagination-item ' + (page === meta.current_page ? 'active' : '')
                        }>
                        {page}
                    </div>
                ))}
                <div
                    onClick={() => setPage(meta.last_page)}
                    className={
                        'pagination-item ' +
                        (meta.current_page === meta.last_page ? 'disabled' : '')
                    }>
                    <em className="mdi mdi-chevron-right">&#187;</em>
                </div>
            </div>
        </div>
    );
}

export default Paginator;
