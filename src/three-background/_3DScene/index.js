import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import PropTypes from 'prop-types';
import GLB_object from '../../Components/GLBobject';
import { load3DSceneTextures } from '../../utils/LOD_helper';

const _3DScene = ({
	scene,
	_3dModelURL,
	glb_model_position,
	backgroundUrl,
	environmentMapURL,
	use_scene_background_as_environment_map = false,
	onBackgroundReady = () => {},
	onBackgroundLoaded = () => {},
}) => {
	const _3dModelRef = useRef();

	console.log('%c _3DScene', 'color:blue', {
		scene,
		_3dModelURL,
		backgroundUrl,
		environmentMapURL,
		use_scene_background_as_environment_map,
	});

	useEffect(() => {
		scene.background = new THREE.Color('#000000');
	}, []);

	//Scene Background
	useEffect(() => {
		if (backgroundUrl) {
			load3DSceneTextures(backgroundUrl)
				.then((texture) => {
					scene.background = texture;
					onBackgroundReady(true);
					onBackgroundLoaded(true);
					if (
						use_scene_background_as_environment_map &&
						!environmentMapURL
					)
						scene.environment = scene.background;
				})
				.catch((err) => {
					console.error('Error loading scene images', err);
				});
		}

		return () => {
			if (scene?.background?.dispose) {
				scene.background.dispose();
				scene.background = null;
			}
			//if use_scene_background_as_environment_map option was true, then:
			if (scene?.environment?.dispose) {
				scene.environment.dispose();
				scene.environment = null;
			}
		};
	}, [backgroundUrl]);

	//Scene Environment
	useEffect(() => {
		if (environmentMapURL) {
			load3DSceneTextures(environmentMapURL)
				.then((texture) => {
					scene.environment = texture;
				})
				.catch((err) => {
					console.error('Error loading scene images', err);
				});
		}

		return () => {
			if (scene?.environment?.dispose) {
				scene.environment.dispose();
				scene.environment = null;
			}
		};
	}, [environmentMapURL]);

	//3D Model
	useEffect(() => {
		if (_3dModelURL) {
			_3dModelRef.current = new GLB_object({
				url: _3dModelURL,
				name: '3d-scene-page-model',
			});
			_3dModelRef.current.position.set(
				glb_model_position?.x || 0,
				glb_model_position?.y || 0,
				glb_model_position?.z || 0,
			);
			// _3dModelRef.current.lookA
			scene.add(_3dModelRef.current);
		}
		return () => {
			if (_3dModelRef?.current?.dispose) _3dModelRef.current.dispose();
			scene.remove(_3dModelRef.current);
		};
	}, [_3dModelURL]);

	return false;
};

_3DScene.propTypes = {
	backgroundUrl: PropTypes.string,
};

export default _3DScene;
