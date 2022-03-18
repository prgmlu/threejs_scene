import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import ThreeBackgroundCube from './ThreeBackgroundCube';


const BackgroundCube = ({ scene, backgroundUrl , camera, linkedScenes, imageIntegrity, useWebp}) => {
    const cube = useRef();
    useEffect(() => {
        cube.current = new ThreeBackgroundCube(camera);
        cube.current.addToScene(scene);

        return () => {
            cube.current.dispose();
            cube.current.removeFromScene();
        };
    }, []); // eslint-disable-line

    useEffect(() => {
        if (backgroundUrl) cube.current.loadCubeTextureFromPriorityArray(backgroundUrl, imageIntegrity, useWebp);

    }, [backgroundUrl]);

    // useEffect(() => {
    //     cube.current.preLoadConnectedScenes(linkedScenes)
    // }, [linkedScenes])

    useEffect(() => {
        cube.current.camera = camera;
    }, [camera]);

    return null;
};

BackgroundCube.propTypes = {
    backgroundUrl: PropTypes.string,
};

export default BackgroundCube;
