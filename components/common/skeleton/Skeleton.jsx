import React from 'react';

const Skeleton = ({ className, style }) => {
    const defaultStyles = {
        backgroundColor: '#e2e8f0',
        animation: 'skeleton-loading 1.5s infinite linear',
        borderRadius: '4px',
        ...style,
    };

    return <div className={className} style={defaultStyles} />;
};

export default Skeleton;
