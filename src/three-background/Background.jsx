import React, { useEffect, useMemo, useRef } from 'react';
import BackgroundCube from './BackgroundCube';
import FlatBackground from './FlatBackground';
import _3DScene from './_3DScene';
import * as THREE from 'three';
import RealtimeBackgroundContainer from './RealtimeBackground';
import { setUpEnvMap } from './threeHelpers';

const Background = ({
	scene,
	bgConf,
	resetBGBeforeImageLoaded,
	camera,
	renderer,
	linkedScenes,
	enablePan = false,
	type,
	controller,
	onBackgroundReady = () => {},
	onBackgroundLoaded = () => {},
	enableZoomControls
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
			enableZoomControls: enableZoomControls,
		}),
		[bgConf],
	);
	
	const loadFlatBackground = () => {
		if(type === 'zoom' && sceneConfig.enableZoomControls){
			onBackgroundReady();
			onBackgroundLoaded();
			return <></>
		}else{
			return (
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
			);
		}
		
	};

	let realTimeRoomId = "6358559a238095b8792b5dc9";

	if(bgConf.backgroundUrl.includes(realTimeRoomId)){
		onBackgroundReady();
		onBackgroundLoaded();
		return (
			<RealtimeBackgroundContainer
			renderer={renderer}
			camera={camera}
			controller={controller}
			backgroundUrl={bgConf.backgroundUrl} scene={scene}/>
		)}

else{

	return (
		<>
			{bgConf.sceneType === 'flat_scene' && (
				loadFlatBackground()
			)}
			{bgConf.sceneType === 'cubemap_scene' &&(
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


			{['3d_model_scene', '3d_scene'].includes(bgConf?.sceneType) && (
				<_3DScene
				scene={scene}
				{...bgConf}
				onBackgroundReady={onBackgroundReady}
				onBackgroundLoaded={onBackgroundLoaded}
				/>
				)}
		</>
	);
};
}

export default Background;
