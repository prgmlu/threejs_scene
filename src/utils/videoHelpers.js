import * as THREE from 'three';

export const createNormalVidMaterial = (video) => {
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

export const createGreenScreenMaterial = (keyColor, fShader, vShader) => {
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

export const createVidDom = function (
	src,
	autoplay = false,
	muted = false,
	loop = false,
) {
	let video = document.createElement('video');
	video.src = src;
	video.setAttribute('webkit-playsinline', '');
	video.crossOrigin = 'anonymous';
	video.setAttribute('playsinline', '');

	if (loop) {
		video.setAttribute('loop', 'loop');
		video.loop = loop;
	}

	if (autoplay) {
		video.setAttribute('autoplay', 'autoplay');
		video.autoplay = autoplay;
	}

	if (muted) {
		video.setAttribute('muted', '');
		video.muted = muted;
	}
	video.currentTime = 0.01;
	return video;
};
