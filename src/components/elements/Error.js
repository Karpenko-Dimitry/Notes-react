import React from 'react';

const Error = ({ message = '404 Something went wrong!' }) => {
    return (
        <div className="col-lg-8 blog-main d-flex align-items-center justify-content-center">
            <div className="alert alert-warning" role="alert">
                {message}
            </div>
        </div>
    );
};

export default Error;
