import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import PropTypes from 'prop-types';
import GLB_object from '../../Components/GLBobject';

const _3DModelScene = ({
	scene,
	_3dModelURL,
	backgroundUrl,
	onBackgroundReady,
	onBackgroundLoaded,
}) => {
	const _3dModelRef = useRef();
	const lightRef = useRef();

	useEffect(() => {
		console.log('%c _3DModelScene', 'color:blue', {
			scene,
			_3dModelURL,
			backgroundUrl,
		});
		scene.background = new THREE.Color('#79b1ee');
		console.log('=> _3dModelURL', _3dModelURL);
		if (_3dModelURL) {
			_3dModelRef.current = new GLB_object({ url: _3dModelURL });
			_3dModelRef.current.position.set(0, -0.1, 0);
			onBackgroundReady();
			onBackgroundLoaded();
			scene.add(_3dModelRef.current);
			addAmbientLight();
		}

		return () => {
			scene.remove(_3dModelRef.current);
			scene.remove(lightRef.current);
		};
	}, []);

	const addAmbientLight = () => {
		lightRef.current = new THREE.AmbientLight(0xffffff, 1);
		lightRef.current.name = 'ambient-light';
		scene.add(lightRef.current);
	};

	return false;
};

_3DModelScene.propTypes = {
	backgroundUrl: PropTypes.string,
};

export default _3DModelScene;
