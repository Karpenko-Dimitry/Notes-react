import React from 'react';

import Error from '../elements/Error';
import Header from '../elements/Header';

const NotFound = () => {
    return (
        <>
            <Header />
            <main role="main" className="container">
                <div className="row">
                    <Error />
                </div>
            </main>
        </>
    );
};

export default NotFound;
