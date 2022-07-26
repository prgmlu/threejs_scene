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
}) => {
	const flatBackground = useRef();

	useEffect(() => {
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

	useEffect(() => {
		//sometimes we want to erase previously loaded image texture
		//to avoid flickering
		if (resetBGBeforeImageLoaded) flatBackground.current.resetMaterial();

		if (backgroundUrl) {
			flatBackground.current.loadTexture(
				`${backgroundUrl}?v=${
					imageIntegrity
						? imageIntegrity
						: formatDate(new Date(), 'mmddyyyyhh')
				}`,
			);
		}
	}, [backgroundUrl]);

	return null;
};

FlatBackground.propTypes = {
	backgroundUrl: PropTypes.string.isRequired,
};

export default FlatBackground;
