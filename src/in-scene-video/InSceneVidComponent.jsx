import * as THREE from 'three';
import React, { useEffect, useRef } from 'react';
import { vShader, fShader } from './shaders';

export const createNormalVidMaterial = function (video, geometry) {
	const videoTexture = new THREE.VideoTexture(video);
	videoTexture.minFilter = THREE.LinearFilter;
	videoTexture.magFilter = THREE.LinearFilter;

	const loader = new THREE.TextureLoader();
	loader.crossOrigin = '';

	var materialParams = {
		transparent: true,
		side: THREE.DoubleSide,
		opacity: 1,
		toneMapped: false,
		map: videoTexture,
	};

	var videoMaterial = new THREE.MeshBasicMaterial({ ...materialParams });

	return videoMaterial;
};

export const createGreenScreenMaterial = function (keyColor){
	var width = 1280;
	var height = 720;
	var keyColor = keyColor;

	var vals = {
        uniforms: {
          tex: {
            value: null
          },
          keyColor: {
            value: new THREE.Color(keyColor)
          },
          texWidth: {
            value: width
          },
          texHeight: {
            value: height
          },
          similarity: {
            value: .4
          },
          smoothness: {
            value: 0.08
          },
          spill: {
            value: .1
          }

        },
        vertexShader: vShader,
        fragmentShader: fShader,

        transparent: true,
        opacity: 0
      };
	var sMat = new THREE.ShaderMaterial();
	sMat.setValues(vals);

  return sMat;
}


const createVidDomForNormalVid = function (src) {
	var video = document.createElement('video');
	video.src = src;
	video.setAttribute('webkit-playsinline', '');
	video.crossOrigin = 'anonymous';
	video.setAttribute('playsinline', '');
	video.setAttribute('loop', 'loop');
	video.setAttribute('autoplay', 'autoplay');
	video.muted = true;
	video.play();
	return video;
};



const createVidDomForGreenScreen = function (src, scene, vidMesh) {
	var video = document.createElement('video');
	video.addEventListener('loadeddata', () => {

		window.addEventListener('click', () => {
			video.play();
			scene.add(vidMesh);
		})
		window.addEventListener('touchend', () => {
			video.play();
			scene.add(vidMesh);
		})
	})
	video.src = src;
	video.setAttribute('webkit-playsinline', '');
	video.crossOrigin = 'anonymous';
	video.setAttribute('playsinline', '');
	//   video.setAttribute('loop', 'loop');
	// video.setAttribute('autoplay', 'false');
	video.muted = false;
	return video;
}


const InSceneVidComponent = (props) => {
	let { src, scene, transform, keyColor, sceneRef } = props;
	scene = sceneRef?.current || scene;
	var vidMesh = useRef(null);


	useEffect(() => {
		var geometry = new THREE.PlaneGeometry(1, 1);
		geometry.scale(- 1, 1, 1);

		if (keyColor) {
			var material = createGreenScreenMaterial(keyColor);
			vidMesh.current = new THREE.Mesh(geometry, material);
			const video = createVidDomForGreenScreen(src, scene, vidMesh.current);

			var texture = new THREE.VideoTexture(video);
			vidMesh.current.material.uniforms.tex.value = texture;
		}

		else {
			const video = createVidDomForNormalVid(src);
			var material = createNormalVidMaterial(video, geometry);
			vidMesh.current = new THREE.Mesh(geometry, material);
			 
			scene.add(vidMesh.current);
		}

		let transformMatrix = new THREE.Matrix4();
		transformMatrix.elements = transform;

		transformMatrix.decompose(
			vidMesh.current.position,
			vidMesh.current.quaternion,
			vidMesh.current.scale,
		);

		return () => {
			scene.remove(vidMesh.current);
		};
	}, [scene]);

	return <div></div>;
};

export default InSceneVidComponent;
