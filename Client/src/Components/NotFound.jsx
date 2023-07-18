import React from 'react';

const NotFound404 = () => {
    const pageStyle = {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems:'center',
        height: '100vh',
        background: '#fdf6e3',
        color: '#073642'
    }

    const bigTextStyle = {
        fontSize: '10rem',
        fontWeight: 'bold',
        margin: '0',
        color: '#859900',
    };

    const smallTextStyle = {
        fontSize: '2rem',
        fontWeight: 'normal',
        marginTop: '1rem',
    };

    return (
        <div style={pageStyle}>
            <p style={bigTextStyle}>404</p>
            <p style={smallTextStyle}>Sorry, page not found.</p>
        </div>
    );
};

export default NotFound404;