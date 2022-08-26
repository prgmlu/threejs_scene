import React, { useMemo } from 'react';
import BackgroundCube from './BackgroundCube';
import FlatBackground from './FlatBackground';
import _3DModelScene from './_3DModelScene';

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
	const sceneConfig = useMemo(
		() => ({
			sceneType: bgConf.sceneType,
			backgroundUrl: bgConf.backgroundUrl,
			_3model: bgConf._3model,
			opacityMapUrl: bgConf?.opacityMapUrl,
			imageIntegrity: bgConf?.imageIntegrity,
			useWebp: bgConf?.useWebp,
			skipLargest: bgConf?.skipLargest,
		}),
		[bgConf],
	);

	return (
		<>
			{bgConf.sceneType === 'flat_scene' && (
				<FlatBackground
					backgroundUrl={sceneConfig.backgroundUrl}
					scene={scene}
					resetBGBeforeImageLoaded={resetBGBeforeImageLoaded}
					imageIntegrity={sceneConfig.imageIntegrity}
					enablePan={enablePan}
					type={type}
					onBackgroundReady={onBackgroundReady}
					onBackgroundLoaded={onBackgroundLoaded}
				/>
			)}
			{bgConf.sceneType === 'cubemap_scene' && (
				<BackgroundCube
					backgroundUrl={sceneConfig.backgroundUrl}
					opacityMapUrl={sceneConfig.opacityMapUrl}
					camera={camera}
					scene={scene}
					linkedScenes={linkedScenes}
					imageIntegrity={sceneConfig.imageIntegrity}
					useWebp={sceneConfig.useWebp}
					skipLargest={sceneConfig.skipLargest}
					controller={controller}
					onBackgroundReady={onBackgroundReady}
					onBackgroundLoaded={onBackgroundLoaded}
					materialProperties={bgConf?.materialProperties}
				/>
			)}
			{sceneConfig.sceneType === '3d_model_scene' && (
				<_3DModelScene
					backgroundUrl={sceneConfig.backgroundUrl}
					scene={scene}
					onBackgroundReady={onBackgroundReady}
					onBackgroundLoaded={onBackgroundLoaded}
					_3dModelURL={bgConf._3dModelURL}
				/>
			)}
		</>
	);
};

export default Background;
