import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import ThreeFlatBackground from './ThreeFlatBackground';
import { formatDate } from '../../utils';

const FlatBackground = ({
	scene,
	backgroundUrl,
	resetBGBeforeImageLoaded,
	imageIntegrity,
	enablePan = false,
	type,
	onBackgroundReady = () => {},
	onBackgroundLoaded = () => {},
}) => {
	const flatBackground = useRef();

	useEffect(() => {
		console.log(
			'%c >INIT:1 - FlatBackground',
			'color:green',
			backgroundUrl,
		);
		flatBackground.current = new ThreeFlatBackground(enablePan, type);
		if (scene) flatBackground.current.addToScene(scene);
		window.addEventListener('resize', flatBackground.current.setPanArea);

		return () => {
			flatBackground.current.dispose();
			window.removeEventListener(
				'resize',
				flatBackground.current.setPanArea,
			);
		};
	}, []);

	const onLoaded = () => {
		onBackgroundReady();
		onBackgroundLoaded();
	};

	useEffect(() => {
		//sometimes we want to erase previously loaded image texture
		//to avoid flickering
		if (resetBGBeforeImageLoaded) flatBackground.current.resetMaterial();

		if (backgroundUrl) {
			flatBackground.current.loadTexture(
				`${backgroundUrl}?key=${
					imageIntegrity
						? imageIntegrity
						: formatDate(new Date(), 'mmddyyyyhh')
				}`,
				onLoaded,
			);
		}
	}, [backgroundUrl]);

	return null;
};

FlatBackground.propTypes = {
	backgroundUrl: PropTypes.string.isRequired,
};

export default FlatBackground;
