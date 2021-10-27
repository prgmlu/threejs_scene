import React, { forwardRef, useEffect } from 'react';
import PropTypes from 'prop-types';

const ThreeCanvas = forwardRef(({ width, height }, ref) => {
    const onWindowResize = () => {
        ref.current.style.height = height; // eslint-disable-line
        ref.current.style.width = width; // eslint-disable-line
    };

    useEffect(() => {
        window.addEventListener('resize', onWindowResize);
        return () => {
            window.removeEventListener('resize', onWindowResize);
        };
    }, []); // eslint-disable-line

    return (
        <canvas
            ref={ref}
            width={width}
            height={height}
            style={
                {
                    width,
                    height,
                    zIndex: -1,
                }
            }
        />
    );
});

ThreeCanvas.propTypes = {
    height: PropTypes.string,
    width: PropTypes.string,
};

ThreeCanvas.defaultProps = {
    height: '100%',
    width: '100%',
};

export default ThreeCanvas;
