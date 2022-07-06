import React, { useState, useEffect } from 'react';
import BackgroundCube from './BackgroundCube';
import FlatBackground from './FlatBackground';
import RealtimeBackgroundContainer from './RealtimeBackground';
import { setUpEnvMap, setUpSceneBackground, adjustRenderer } from './threeHelpers';

const Background = ({
	scene,
	renderer,
	bgConf,
	resetBGBeforeImageLoaded,
	camera,
	linkedScenes,
	enablePan = false,
	type,
	controller,
}) => {
	const [backgroundUrl, setBackgroundUrl] = useState('');
	const [opacityMapUrl, setOpacityMapUrl] = useState('');
	const [isFlatScene, setFlatScene] = useState(false);
	const [isCubeScene, setCubeScene] = useState(false);

    const [isRealtimeScene, setRealtimeScene] = useState(false);
	window.isRealtimeScene = isRealtimeScene;
	window.setRealtimeScene = setRealtimeScene;
	const [imageIntegrity, setImageIntegrity] = useState(null);
	const [useWebp, setUseWebp] = useState(false);
	const [skipLargest, setSkipLargest] = useState(false);

	console.log('%c >INIT: - Background', 'color:green', bgConf);

	useEffect(() => {
		if (bgConf) {
			// setFlatScene(bgConf.isFlatScene);
            // setCubeScene(bgConf.isCubeScene);
			// setRealtimeScene(bgConf.isRealtimeScene)

			if (bgConf.isFlatScene) {
				setFlatScene(true);
				setRealtimeScene(false)
				setCubeScene(false)
				
			}
			else{
				if(bgConf.backgroundUrl.includes("6298f357400ce6b3db706a68")) {

					setUpEnvMap(scene, renderer);
					setUpSceneBackground (scene);
					adjustRenderer(renderer);

					setRealtimeScene(true);
					setFlatScene(false)
					setCubeScene(false)
					
				}
				else{
					setCubeScene(true);
					setRealtimeScene(false)
					setFlatScene(false)
					
				}
			}



			setBackgroundUrl(bgConf.backgroundUrl);
			setOpacityMapUrl(bgConf.opacityMapUrl);
			setImageIntegrity(bgConf?.imageIntegrity);
			setUseWebp(bgConf?.useWebp);
			setSkipLargest(bgConf?.skipLargest);
		}
	}, [bgConf]);

	return (
		<>
		{isFlatScene && <FlatBackground
			backgroundUrl={backgroundUrl}
			scene={scene}
			resetBGBeforeImageLoaded={resetBGBeforeImageLoaded}
			imageIntegrity={imageIntegrity}
			enablePan={enablePan}
			type={type}
			/>
		}
		{
			isCubeScene && <BackgroundCube
			backgroundUrl={backgroundUrl}
			opacityMapUrl={opacityMapUrl}
			camera={camera}
			scene={scene}
			linkedScenes={linkedScenes}
			imageIntegrity={imageIntegrity}
			useWebp={useWebp}
			skipLargest={skipLargest}
			controller={controller}
			/>
		}
         {
			isRealtimeScene && <RealtimeBackgroundContainer 
			renderer={renderer}
			backgroundUrl={backgroundUrl} scene={scene}/>
		 }
		</>
		)
};

export default Background;
