import React from 'react';

import NavBar from './NavBar';

const Header = ({ callback = false }) => {
    return (
        <div className="container">
            <NavBar callback={callback} />
        </div>
    );
};

export default Header;
