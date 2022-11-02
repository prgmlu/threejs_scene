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
	const ambientLightRef = useRef();
	const directionalLightRef = useRef();

	const initLight = (type = 'ambient', config = {}) => {
		const lightInstance =
			type === 'ambient'
				? THREE.AmbientLight
				: type === 'directional'
				? THREE.DirectionalLight
				: false;
		const refInstance =
			type === 'ambient'
				? ambientLightRef
				: type === 'directional'
				? directionalLightRef
				: false;
		refInstance.current = new lightInstance(
			config.color || 0xffffff,
			config.intensity || 1,
		);
		refInstance.current.name = `${type}-light`;
		refInstance.current.userData.config = config;
		scene.add(refInstance.current);
	};

	const updateLightConf = (type = 'ambient', config = {}) => {
		const refInstance =
			type === 'ambient'
				? ambientLightRef
				: type === 'directional'
				? directionalLightRef
				: false;

		if (config.color)
			refInstance.current.color = new THREE.Color(config.color);
		if (config?.intensity >= 0)
			refInstance.current.intensity = config.intensity;
		refInstance.current.userData.config = config; //update config
	};
	const isPropsEqual = (obj1, obj2) =>
		JSON.stringify(obj1) === JSON.stringify(obj2);

	//Ambient Light
	useEffect(() => {
		if (bgConf?.ambient_light && !ambientLightRef.current)
			initLight('ambient', bgConf?.ambient_light);
		//config changed
		else if (
			bgConf?.ambient_light &&
			ambientLightRef.current &&
			!isPropsEqual(
				bgConf?.directional_light,
				ambientLightRef.current.userData.config,
			)
		) {
			updateLightConf('ambient', bgConf?.ambient_light);
		}
		//was turned off
		else if (!bgConf?.ambient_light && ambientLightRef.current) {
			scene.remove(ambientLightRef.current);
			ambientLightRef.current = null;
		}
	}, [bgConf?.ambient_light]);

	//Directional Light
	useEffect(() => {
		//first time enabled
		if (bgConf?.directional_light && !directionalLightRef.current)
			initLight('directional', bgConf?.directional_light);
		//config changed
		else if (
			bgConf?.directional_light &&
			directionalLightRef.current &&
			!isPropsEqual(
				bgConf?.directional_light,
				directionalLightRef.current.userData.config,
			)
		) {
			updateLightConf('directional', bgConf?.directional_light);
		}
		//was disabled
		else if (!bgConf?.directional_light && directionalLightRef.current) {
			scene.remove(directionalLightRef.current);
			directionalLightRef.current = null;
		}
	}, [bgConf?.directional_light]);

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

	debugger;
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
