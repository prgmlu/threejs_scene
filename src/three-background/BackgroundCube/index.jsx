import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import ThreeBackgroundCube from './ThreeBackgroundCube';


// SET LOD
const LOD = 3;

const BackgroundCube = ({ scene, backgroundUrl }) => {
    const cube = useRef();

    useEffect(() => {
        cube.current = new ThreeBackgroundCube(LOD);
        cube.current.resolveFaceMaterialIndexes(1);

        cube.current.addToScene(scene);
        cube.current.objectWireframe.addToScene(scene);

        return () => {
            cube.current.dispose();
        };
    }, []); // eslint-disable-line

    useEffect(() => {
        if (backgroundUrl) {
            cube.current.loadCubeTexture(backgroundUrl);
        }
    }, [backgroundUrl]);

    return null;
};

BackgroundCube.propTypes = {
    backgroundUrl: PropTypes.string,
};

export default BackgroundCube;
