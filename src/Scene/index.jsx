import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { isMobile } from 'react-device-detect';
import ThreeController from '../three-controls/ThreeController';
import {
	initThreeJSScene,
	setupRenderer,
	setupCamera,
} from './setupThreeEditor';
import { threeEditorMouseEvents } from './threeEditorMouseEvents';
import { threeEditorKeyboardEvents } from './threeEditorKeyboardEvents';
import { Background, ColliderSphere } from '../three-background';
import DebugUI from '../utils/DebugUI';
import './main.scss';

const createRenderer = (sceneId = '', type) => {
	let rendererKey;

	switch (type) {
		case 'containerInstance':
			rendererKey = `${type}_renderer`;
			break;
		case 'zoom':
			rendererKey = `${sceneId}_renderer`;
			break;
	}

	const ret = window[rendererKey] || new THREE.WebGLRenderer();

	window[rendererKey] = ret;
	ret.info.autoReset = true;
	return ret;
};

const createOrGetCamera = (camType, canvasRef, sceneId = '', type) => {
	const aspectRatio =
		canvasRef.current.offsetWidth / canvasRef.current.offsetHeight;

	let cameraKey;

	switch (type) {
		case 'containerInstance':
			cameraKey = `${type}_${camType}_camera`;
			break;
		case 'zoom':
			cameraKey = `${sceneId}_${camType}_camera`;
			break;
	}

	if (window[cameraKey]) {
		return window[cameraKey];
	}

	const camera = new THREE.PerspectiveCamera(70, aspectRatio, 0.1, 1000);

	window[cameraKey] = camera;
	setupCamera(camera);
	return window[cameraKey];
};

const createOrGetControls = (
	camType,
	cameraRef,
	renderer,
	orbitControlsConfig,
	sceneId,
	type,
) => {
	let controllerKey;

	switch (type) {
		case 'containerInstance':
			controllerKey = `${type}_${camType}_controller`;
			break;
		case 'zoom':
			controllerKey = `${sceneId}_${camType}_controller`;
			break;
	}

	if (window[controllerKey]) {
		return window[controllerKey];
	}

	const controls = ThreeController.setupControls(
		cameraRef.current,
		renderer,
		orbitControlsConfig,
	);

	if (camType === 'flat') {
		controls.enableRotate = false;
	}

	window[controllerKey] = controls;
	return window[controllerKey];
};

const Scene = (props) => {
	const {
		sceneId,
		allowEventsForMarkerTypeOnly,
		bgConf,
		useDebugger = false,
		allowHotspotsToMove,
		resetBGBeforeImageLoaded = false,
		children,
		fps = 60,
		type,
		enablePan = false,
		orbitControlsConfig = {},
	} = props;
	const [threeReady, setThreeReady] = useState(false);
	const [maxRenderOrder, setMaxRenderOrderAction] = useState(1);
	const [animationId, setAnimationId] = useState();
	const timeOutRef = useRef(null);
	const [UI, setUI] = useState();
	//Scene
	const sceneRef = useRef(new THREE.Scene());
	const scene = sceneRef.current;

	//Renderer
	const rendererRef = useRef(createRenderer(sceneId, type));

	let renderer = rendererRef.current;
	const glContext = renderer?.getContext('webgl');

	// useRef used to prevent Scene from losing variable references.
	const canvasRef = useRef();
	const cameraRef = useRef();
	const controlsRef = useRef();

	sceneRef.current.setUI = setUI;

	const setMaxRenderOrder = (renderOrder) => {
		if (renderOrder >= maxRenderOrder)
			setMaxRenderOrderAction(renderOrder + 1);
	};

	const animate = (controllerUpdate = false, animationKey) => {
		
		if (renderer.xr.enabled) {
			renderer.setAnimationLoop(() => {
				renderer?.render(scene, cameraRef.current);
				if (controllerUpdate) controllerUpdate();
			});
		} else {
			timeOutRef.current = setTimeout(() => {
				if (animationKey) {
					window[animationKey] = requestAnimationFrame(() =>
						animate(controllerUpdate, animationKey),
					);
				}
			}, 1000 / fps);

			renderer?.render(scene, cameraRef.current);

			if (controllerUpdate) controllerUpdate();
		}
	};

	const handleContextLoss = (e) => {
		console.log(
			'%c Context lost. restoring context...',
			'color:red;text-decoration:underline',
		);

		e.preventDefault();
		setTimeout((e) => {
			console.log(
				'%c Context lost. restoring context 2...',
				'color:red;text-decoration:underline',
			);

			//restoreContext() will ONLY simulate restoring of the context
			//run restore only if context lost, otherwise error will be thrown
			// if(!glContext) loseExtension?.restoreContext();
			glContext.getExtension('WEBGL_lose_context').restoreContext();
			renderer.clear();
		}, 50);
	};

	const handleContextRestored = () => {
		console.log(
			'%c Context restored',
			'color:green;text-decoration:underline',
		);
		setupRenderer(rendererRef.current, canvas);
		scene.add(cameraRef.current);
		window.containerInstance_renderer?.forceContextRestore();
	};

	//1. Mount camera & setup renderer only once!!!
	useEffect(() => {
		console.log(
			'%c >INIT:1 - initThreeJSScene',
			'color:green',
			JSON.parse(JSON.stringify({ rendererRef: rendererRef.current })),
		);
		let canvas = canvasRef.current;
		initThreeJSScene(canvasRef, cameraRef, controlsRef, rendererRef, scene);
		setThreeReady(true);

		renderer.domElement.addEventListener(
			'webglcontextlost',
			handleContextLoss,
		);
		renderer.domElement.addEventListener(
			'webglcontextrestored',
			handleContextRestored,
		);

		return () => {
			console.log('%c >INIT:1 - unmounted', 'color:gray');
			renderer.domElement.removeEventListener(
				'webglcontextlost',
				handleContextLoss,
			);
			renderer.domElement.removeEventListener(
				'webglcontextrestored',
				handleContextRestored,
			);
			// canvas
			canvasRef.current = null;
			// Dispose the renderer and scene
			clearRoom();
		};
	}, []);

	const initRoom = () => {
		let camType = 'cube';
		if (bgConf?.isFlatScene) {
			camType = 'flat';
		} else if (Object.keys(orbitControlsConfig).length > 0) {
			camType = 'custom';
		}
		// set new reference for cameraRef.current here
		cameraRef.current = createOrGetCamera(
			camType,
			canvasRef,
			sceneId,
			type,
		);

		controlsRef.current = createOrGetControls(
			camType,
			cameraRef,
			renderer,
			orbitControlsConfig,
			sceneId,
			type,
		);

		if (Object.keys(orbitControlsConfig).length > 0) {
			controlsRef.current.setupRotateControls(orbitControlsConfig);
		}

		let animationKey;

		switch (type) {
			case 'containerInstance':
				animationKey = `${type}_animationId`;
				break;
			case 'zoom':
				animationKey = `${sceneId}_animationId`;
				break;
		}
		window[animationKey] = '';
		setAnimationId(animationKey);
		animate(controlsRef.current.update, animationKey);
	};

	//New Scene INIT
	useEffect(() => {
		initRoom();

		return () => {
			//ThreeBackgroundCube textures disposal.
			//TODO: investigate where and when the reference on the objects was lost.
			// and place cleanup solution in appropriate place.
			scene?.children?.map((child) => {
				if (child?.material?.length) {
					child.material.forEach((mesh) => {
						mesh?.map?.dispose();
						mesh?.dispose();
					});
				}
				if (child?.type === 'PerspectiveCamera') {
					scene.remove(child);
				}
			});

			setUI(false); //Hide UI Modal when scene changed
		};
	}, [sceneId]);

	//Events
	useEffect(() => {
		let canvasContainer = canvasRef.current;

		// mouse event listeners
		const {
			addThreeEditorMouseEventListeners,
			removeThreeEditorMouseEventListeners,
			resetHovers,
		} = threeEditorMouseEvents(
			sceneRef,
			renderer,
			controlsRef,
			cameraRef,
			canvasContainer,
			allowEventsForMarkerTypeOnly,
			allowHotspotsToMove,
			props.onMouseDown,
			props.onMouseUp,
			props.onMouseMove,
		);

		const {
			addThreeEditorKeyboardEvents,
			removeThreeEditorKeyboardEvents,
		} = threeEditorKeyboardEvents(controlsRef);

		addThreeEditorMouseEventListeners();
		addThreeEditorKeyboardEvents();

		return () => {
			removeThreeEditorMouseEventListeners();
			removeThreeEditorKeyboardEvents();
			resetHovers();
			canvasContainer = null;
		};
	}, [
		sceneId,
		sceneRef,
		cameraRef,
		allowEventsForMarkerTypeOnly,
		allowHotspotsToMove,
	]); // eslint-disable-line

	useEffect(() => {
		return () => {
			// Clear Animation loop
			if (animationId) {
				window.cancelAnimationFrame(window[animationId]);
				clearTimeout(timeOutRef.current);
				delete window[animationId];
			}
		};
	}, [animationId]);

	//windowResizer placed separately because it requires to track and call UI & setUI
	//while at same time we DO NOT WANT to remount all events each time when UI changed
	//reminder: UI changed on each on scene click
	useEffect(() => {
		const windowResizeHandler = () => {
			const canvasContainer = canvasRef.current;
			const width = canvasContainer.offsetWidth;
			const height = canvasContainer.offsetHeight;

			cameraRef.current.aspect = width / height;
			cameraRef.current.updateProjectionMatrix();
			renderer.setSize(width, height);

			if (UI) setUI(false); //destroy UI
		};

		window.addEventListener('resize', windowResizeHandler);
		return () => {
			window.removeEventListener('resize', windowResizeHandler);
		};
	}, [UI]);

	const clearRoom = () => {
		// Renderer
		const rendererKey = `${sceneId}_renderer`;
		delete window[rendererKey];

		if (renderer) {
			renderer.info.autoReset = false;
			renderer.info.memory.textures = 0;
			renderer.info.memory.geometries = 0;
			renderer.renderLists.dispose();
			renderer.info.reset();
			renderer.state.reset();
			renderer.forceContextLoss();
			renderer.domElement.remove();
			renderer.dispose();
			renderer = null;
			rendererRef.current = null;
		}
		// Controls
		controlsRef.current.dispose();
	};

	const onDropEvent = (e) => {
		e.preventDefault();

		// Set Position to in front of camera
		const position = new THREE.Vector3(0, 0, -10);
		position.applyQuaternion(cameraRef.current.quaternion);
		sceneRef.current.userData.clickData = { e, point: position };
		setMaxRenderOrder(maxRenderOrder);

		if (props.onDrop) props.onDrop(e, position, maxRenderOrder);
	};

	return (
		<>
			{useDebugger && (
				<DebugUI
					renderer={rendererRef.current}
					scene={sceneRef.current}
					glContext={glContext}
				/>
			)}

			<div
				id={props.id ? props.id : 'canvas-wrapper'}
				className={props.id ? props.id : 'canvas-wrapper'}
				ref={canvasRef}
				onDragOver={(e) => e.preventDefault()}
				onDrop={onDropEvent}
			>
				{/*{threeReady && children}*/}
				{threeReady &&
					React.Children.map(children, (child) =>
						React.cloneElement(child, {
							sceneRef,
							setMaxRenderOrder,
						}),
					)}

				{threeReady && (
					<>
						<ColliderSphere scene={scene} />
						<Background
							bgConf={bgConf}
							scene={scene}
							camera={cameraRef.current}
							resetBGBeforeImageLoaded={resetBGBeforeImageLoaded}
							linkedScenes={props.linkedScenes}
							enablePan={enablePan && isMobile}
							type={type}
							controller={controlsRef.current}
						/>
					</>
				)}

				<div
					id="canvasUI"
					className={`canvasUI ${UI ? 'active' : ''}`}
					style={UI?.style}
				>
					{UI && <UI.Component {...UI?.props} sceneRef={sceneRef} />}
				</div>
			</div>
		</>
	);
};

export default Scene;
