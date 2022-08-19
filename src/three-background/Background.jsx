import React, { useState, useEffect } from 'react';
import BackgroundCube from './BackgroundCube';
import FlatBackground from './FlatBackground';

const Background = ({
	scene,
	bgConf,
	resetBGBeforeImageLoaded,
	camera,
	linkedScenes,
	enablePan = false,
	type,
	controller,
	onBackgroundReady = () => {},
	onBackgroundLoaded = () => {},
}) => {
	const [backgroundUrl, setBackgroundUrl] = useState('');
	const [opacityMapUrl, setOpacityMapUrl] = useState('');
	const [isFlatScene, setFlatScene] = useState(false);
	const [imageIntegrity, setImageIntegrity] = useState(null);
	const [useWebp, setUseWebp] = useState(false);
	const [skipLargest, setSkipLargest] = useState(false);

	console.log('%c >INIT: - Background', 'color:green', bgConf);

	useEffect(() => {
		console.log('%c >INIT: - Background', 'color:green');
		if (bgConf) {
			setFlatScene(bgConf.isFlatScene);
			setBackgroundUrl(bgConf.backgroundUrl);
			setOpacityMapUrl(bgConf.opacityMapUrl);
			setImageIntegrity(bgConf?.imageIntegrity);
			setUseWebp(bgConf?.useWebp);
			setSkipLargest(bgConf?.skipLargest);
		}
	}, [bgConf]);

	return isFlatScene ? (
		<FlatBackground
			backgroundUrl={backgroundUrl}
			scene={scene}
			resetBGBeforeImageLoaded={resetBGBeforeImageLoaded}
			imageIntegrity={imageIntegrity}
			enablePan={enablePan}
			type={type}
			onBackgroundReady={onBackgroundReady}
			onBackgroundLoaded={onBackgroundLoaded}
		/>
	) : (
		<BackgroundCube
			backgroundUrl={backgroundUrl}
			opacityMapUrl={opacityMapUrl}
			camera={camera}
			scene={scene}
			linkedScenes={linkedScenes}
			imageIntegrity={imageIntegrity}
			useWebp={useWebp}
			skipLargest={skipLargest}
			controller={controller}
			onBackgroundReady={onBackgroundReady}
			onBackgroundLoaded={onBackgroundLoaded}
			materialProperties={bgConf?.materialProperties}
		/>
	);
};

export default Background;
