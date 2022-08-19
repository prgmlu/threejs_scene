import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import ThreeBackgroundCube from './ThreeBackgroundCube';

const BackgroundCube = ({
	scene,
	backgroundUrl,
	opacityMapUrl,
	camera,
	linkedScenes,
	imageIntegrity,
	useWebp,
	skipLargest,
	controller,
	onBackgroundReady = () => {},
	onBackgroundLoaded = () => {},
	materialProperties = null,
}) => {
	const cube = useRef();

	useEffect(() => {
		cube.current = new ThreeBackgroundCube(camera, controller);
		cube.current.addToScene(scene);

		return () => {
			cube.current.dispose();
			cube.current.removeFromScene();
		};
	}, []); // eslint-disable-line

	useEffect(() => {
		if (backgroundUrl) {
			cube.current.removeAlphaMaps();
			cube.current.loadCubeTextureFromPriorityArray(
				backgroundUrl,
				opacityMapUrl,
				imageIntegrity,
				useWebp,
				skipLargest,
				onBackgroundReady,
				onBackgroundLoaded,
				materialProperties,
			);
		}
	}, [backgroundUrl, opacityMapUrl]);

	useEffect(() => {
		cube.current.camera = camera;
	}, [camera]);

	return null;
};

BackgroundCube.propTypes = {
	backgroundUrl: PropTypes.string,
};

export default BackgroundCube;
