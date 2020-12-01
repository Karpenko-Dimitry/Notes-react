import React from 'react';

const Spiner = () => {
    return (
        <div className="col-md-8 blog-main d-flex justify-content-center align-items-center">
            <div className="spinner-border text-secondary " role="status">
                <span className="sr-only">Loading...</span>
            </div>
        </div>
    );
};

export default Spiner;
