import * as THREE from 'three';
import React, { useEffect, useRef } from 'react';
import {
	createGreenScreenMaterial,
	createNormalVidMaterial,
	createVidDom,
} from '../utils/videoHelpers.js';
import VideoControls from './VideoControls';
import { fShader, vShader } from './shaders';

const InSceneVidComponent = (props) => {
	const {
		src,
		transform,
		keyColor,
		sceneRef,
		addToMediaStack,
		popFromMediaStack,
		userData = {},
		onPlayClicked,
		onPauseClicked,
		playIconUrl,
		pauseIconUrl,
	} = props;

	const scene = sceneRef?.current;
	const autoplay = userData?.props?.autoplay || false;
	const muted = userData?.props?.muted || false;
	const loop = userData?.props?.muted || false;
	const enableControls = userData?.props?.controls?.enable || false;

	let videoRef = useRef(null);
	let videoMeshRef = useRef(null);
	const videoControlsRef = useRef(null);

	const autoplayAfterFirstInteraction = () => {
		document.addEventListener('click', triggerAutoPlay);
		document.addEventListener('touchend', triggerAutoPlay);
	};

	const triggerAutoPlay = () => {
		playVideo().catch(() => {
			autoplayAfterFirstInteraction();
		});
	};

	const onVideoCanPlay = () => {
		scene.add(videoMeshRef.current);
		if (autoplay) {
			triggerAutoPlay();
		}
	};

	const addToStackIfUnmute = () => {
		if (!muted) {
			addToMediaStack(videoRef);
		}
	};

	const playVideo = () => {
		return videoRef.current.play().then(() => {
			addToStackIfUnmute();
		});
	};

	const onUserPlaysVideo = () => {
		onPlayClicked(src);
		playVideo();
	};

	const onUserPausesVideo = () => {
		onPauseClicked(src);
		if (!muted) {
			popFromMediaStack();
		}
	};

	const onVideoEnd = () => {
		if (!loop) {
			popFromMediaStack();
		}
	};

	const setVideoControls = () => {
		videoControlsRef.current = new VideoControls(
			scene,
			transform,
			onUserPlaysVideo,
			onUserPausesVideo,
			playIconUrl,
			pauseIconUrl,
			userData,
		);
	};

	const setTransform = () => {
		const transformMatrix = new THREE.Matrix4();
		transformMatrix.elements = transform;
		transformMatrix.decompose(
			videoMeshRef.current.position,
			videoMeshRef.current.quaternion,
			videoMeshRef.current.scale,
		);
	};

	const setVideoDom = () => {
		videoRef.current = createVidDom(src, autoplay, muted, loop);
	};

	const setupVideoMesh = () => {
		const geometry = new THREE.PlaneGeometry(1, 1);
		geometry.scale(1, 1, 1);
		if (keyColor) {
			//green screen
			const material = createGreenScreenMaterial(
				keyColor,
				fShader,
				vShader,
			);
			videoMeshRef.current = new THREE.Mesh(geometry, material);
			videoMeshRef.current.renderOrder=2;
			videoMeshRef.current.material.depthTest=false;
			videoMeshRef.current.material.depthWrite=false;
			videoMeshRef.current.material.uniforms.tex.value =
				new THREE.VideoTexture(videoRef.current);
		} else {
			const material = createNormalVidMaterial(videoRef.current);
			videoMeshRef.current = new THREE.Mesh(geometry, material);
			videoMeshRef.current.renderOrder=2;
			videoMeshRef.current.material.depthTest=false;
			videoMeshRef.current.material.depthWrite=false;
		}
	};

	const onComponentUmount = () => {
		scene.remove(videoMeshRef.current);

		if (videoMeshRef.current.material) {
			videoMeshRef.current.material.map = null;
			videoMeshRef.current.material.dispose();
			videoMeshRef.current.geometry.dispose();
		}

		if (videoControlsRef.current) {
			videoControlsRef.current.dispose();
		}

		videoRef.current.pause();
		videoRef.current.load();
		videoRef.current.remove();

		videoRef.current.removeEventListener('loadedmetadata', onVideoCanPlay);
		videoRef.current.removeEventListener('ended', onVideoEnd);
		videoRef.current.removeEventListener('play', onPlaying);
		videoRef.current.removeEventListener('paused', onPaused);
	};

	const onPlaying = () => {
		document.removeEventListener('touchend', triggerAutoPlay);
		document.removeEventListener('click', triggerAutoPlay);
		if (videoControlsRef.current) {
			videoControlsRef.current.playing = true;
		}
	};

	const onPaused = () => {
		if (videoControlsRef.current) {
			videoControlsRef.current.playing = false;
		}
	};

	useEffect(() => {
		setVideoDom();

		if (enableControls) {
			setVideoControls();
		}

		setupVideoMesh();
		setTransform();
		videoRef.current.addEventListener('loadedmetadata', onVideoCanPlay);
		videoRef.current.addEventListener('ended', onVideoEnd);
		videoRef.current.addEventListener('play', onPlaying);
		videoRef.current.addEventListener('paused', onPaused);

		return () => {
			onComponentUmount();
		};
	}, [scene]);

	return null;
};

export default InSceneVidComponent;
