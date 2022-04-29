import * as THREE from 'three';
import React, { useEffect, useRef } from 'react';
import { fShader, vShader } from './shaders';

export const createNormalVidMaterial = function (video, geometry) {
	const videoTexture = new THREE.VideoTexture(video);
	videoTexture.minFilter = THREE.LinearFilter;
	videoTexture.magFilter = THREE.LinearFilter;

	const loader = new THREE.TextureLoader();
	loader.crossOrigin = '';

	let materialParams = {
		transparent: true,
		side: THREE.DoubleSide,
		opacity: 1,
		toneMapped: false,
		map: videoTexture,
	};

	return new THREE.MeshBasicMaterial({ ...materialParams });
};

export const createGreenScreenMaterial = function (keyColor) {
	let width = 1280;
	let height = 720;

	let vals = {
		uniforms: {
			tex: {
				value: null,
			},
			keyColor: {
				value: new THREE.Color(keyColor),
			},
			texWidth: {
				value: width,
			},
			texHeight: {
				value: height,
			},
			similarity: {
				value: 0.4,
			},
			smoothness: {
				value: 0.08,
			},
			spill: {
				value: 0.1,
			},
		},
		vertexShader: vShader,
		fragmentShader: fShader,

		transparent: true,
		opacity: 0,
	};
	let sMat = new THREE.ShaderMaterial();
	sMat.side = THREE.DoubleSide;
	sMat.setValues(vals);

	return sMat;
};

const createVidDom = function (src) {
	let video = document.createElement('video');
	video.src = src;
	video.setAttribute('webkit-playsinline', '');
	video.crossOrigin = 'anonymous';
	video.setAttribute('playsinline', '');
	video.setAttribute('loop', 'loop');
	video.setAttribute('autoplay', 'autoplay');
	video.autoplay = true;
	// video.muted = true;
	// video.play();
	return video;
};

const InSceneVidComponent = (props) => {
	let { src, scene, transform, keyColor, sceneRef } = props;
	scene = sceneRef?.current || scene;

	let domVid = useRef(null);
	let vidMesh = useRef(null);

	const onVideoCanPlay = () => {
		scene.add(vidMesh.current);
	};

	useEffect(() => {
		let geometry = new THREE.PlaneGeometry(1, 1);
		geometry.scale(-1, 1, 1);

		if (keyColor) {
			//green screen
			let material = createGreenScreenMaterial(keyColor);
			vidMesh.current = new THREE.Mesh(geometry, material);
			domVid.current = createVidDom(src);
			// domVid.current.loop = false;

			vidMesh.current.material.uniforms.tex.value =
				new THREE.VideoTexture(domVid.current);
		} else {
			domVid.current = createVidDom(src);
			let material = createNormalVidMaterial(domVid.current, geometry);
			vidMesh.current = new THREE.Mesh(geometry, material);
		}

		domVid.current.addEventListener('canplay', onVideoCanPlay);

		let transformMatrix = new THREE.Matrix4();
		transformMatrix.elements = transform;

		transformMatrix.decompose(
			vidMesh.current.position,
			vidMesh.current.quaternion,
			vidMesh.current.scale,
		);

		return () => {
			domVid.current.removeEventListener('canplay', onVideoCanPlay);

			scene.remove(vidMesh.current);
			vidMesh.material.map=null;
			vidMesh.material.dispose();
			vidMesh.geometry.dispose();

			domVid.current.pause();
			domVid.current.empty()     
			domVid.current.load()      
			delete domVid.current;
			domVid.current.remove()
		};
	}, [scene]);

	return <div></div>;
};

export default InSceneVidComponent;
