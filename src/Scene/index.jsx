import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import ThreeController from '../three-controls/ThreeController';
import {
	initThreeJSScene,
	setupRenderer,
	setupCamera,
	createCSS2DRenderer,
} from './setupThreeEditor';
import { threeEditorMouseEvents } from './threeEditorMouseEvents';
import { threeEditorKeyboardEvents } from './threeEditorKeyboardEvents';
import { threeEditorVREvents } from './threeEditorVREvents';
import { Background, ColliderSphere } from '../three-background';
import { isMobile, browserName } from 'react-device-detect';
import DebugUI from '../utils/DebugUI';
import './main.scss';
import LoadingIcon from '../loadingIcon';

const getRendererKey = (type, sceneId) => {
	let rendererKey;

	switch (type) {
		case 'containerInstance':
			rendererKey = `${type}_renderer`;
			break;
		case 'zoom':
			rendererKey = `${sceneId}_renderer`;
			break;
	}
	return rendererKey;
};

const getRenderer = (sceneId = '', type) => {
	const rendererKey = getRendererKey(type, sceneId);
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

class ThreeScene extends THREE.Scene {
	labelsVisible = false;
	labelsMap = {};

	setToolTipsVisibility = (value) => {
		this.children.forEach((child) => {
			if (child.name === 'tooltip') {
				child?.owner?.setVisibility(value);
			}
		});
		this.labelsVisible = value;
	};

	setLabel = (labelId, label) => (this.labelsMap[labelId] = label);
	toggleToolTips = () => this.setToolTipsVisibility(!this.labelsVisible);
	showToolTips = () => this.setToolTipsVisibility(true);
	hideToolTips = () => this.setToolTipsVisibility(false);
}

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
		loadingIconSrc = null,
	} = props;
	const [threeReady, setThreeReady] = useState(false);
	const [showLoadingIcon, setShowLoadingIcon] = useState(true);
	const [renderObjects, setRenderObjects] = useState(false);
	const [maxRenderOrder, setMaxRenderOrderAction] = useState(1);
	const [animationId, setAnimationId] = useState();
	const timeOutRef = useRef(null);
	const [UI, setUI] = useState();

	//Scene
	const sceneRef = useRef(new ThreeScene());
	const scene = sceneRef.current;

	//Renderer
	const rendererRef = useRef(getRenderer(sceneId, type));
	let renderer = rendererRef.current;
	const glContext = renderer?.getContext('webgl');

	const css2DRendererRef = useRef(createCSS2DRenderer());
	let css2DRenderer = css2DRendererRef.current;

	// useRef used to prevent Scene from losing variable references.
	const canvasRef = useRef();
	const cameraRef = useRef();
	const controlsRef = useRef();

	// VR helpers
	const vrControlsRef = useRef([]);
	const vrGripControlsRef = useRef([]);
	const vrHandsRef = useRef([]);
	const isOculusDevice = browserName === 'Oculus Browser';
	const showOnlyHands = true;

	sceneRef.current.setUI = setUI;

	const [userInteracted, setUserInteracted] = useState(false);
	const [interactTimeoutId, setInteractTimeoutId] = useState(null);

	const onUserInteracted = () => {
		setUserInteracted(true);
		window.removeEventListener('click', onUserInteracted);
		if (interactTimeoutId) {
			clearTimeout(interactTimeoutId);
		}
	};

	useEffect(() => {
		window.addEventListener('click', onUserInteracted);
		return () => {
			window.removeEventListener('click', onUserInteracted);
		};
	}, []);

	useEffect(() => {
		if (renderObjects) {
			if (!userInteracted && !interactTimeoutId) {
				const itid = setTimeout(() => {
					if (!userInteracted) {
						scene.showToolTips();
					}
				}, 4000);
				setInteractTimeoutId(itid);
			}
		}
	}, [renderObjects]);

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
			css2DRenderer.render(scene, cameraRef.current);
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
			glContext?.getExtension('WEBGL_lose_context')?.restoreContext();
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
		renderer?.forceContextRestore();
	};

	//1. Mount camera & setup renderer only once!!!
	useEffect(() => {
		console.log('%c >INIT:1 - initThreeJSScene', 'color:green');
		let canvas = canvasRef.current;
		initThreeJSScene(
			canvasRef,
			cameraRef,
			controlsRef,
			rendererRef,
			scene,
			css2DRendererRef,
		);
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
			// console.log('%c >INIT:1 - unmounted', 'color:gray');
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
		if (!showLoadingIcon) {
			setShowLoadingIcon(true);
		}

		if (renderObjects) {
			setRenderObjects(false);
		}

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

		if (isOculusDevice) {
			const sceneLight = [...scene.children].filter(
				(e) => e.type === 'HemisphereLight',
			)[0];
			const light = sceneLight
				? sceneLight
				: new THREE.HemisphereLight(0xffffff, 0x080808, 4);
			scene.add(light);

			const { vrControllers, gripControls, vrHands, handsModels } =
				ThreeController.setupVRControls(renderer, scene, showOnlyHands);

			vrControlsRef.current = vrControllers;
			vrHandsRef.current = vrHands;
		}

		if (Object.keys(orbitControlsConfig).length > 0) {
			controlsRef.current.setupControlsFromConfig(orbitControlsConfig);
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

		const canvasContainer = canvasRef.current;
		const width = canvasContainer.offsetWidth;
		const height = canvasContainer.offsetHeight;

		css2DRenderer.setSize(width, height);

		animate(controlsRef.current.update, animationKey);
	};

	//New Scene INIT
	useEffect(() => {
		initRoom();
		return () => {
			for (let i = scene.children.length - 1; i >= 0; i--) {
				const child = scene.children[i];
				if (child?.material?.length) {
					child.material.forEach((mesh) => {
						mesh?.map?.dispose();
						mesh?.dispose();
					});
				}
				if (child?.type === 'PerspectiveCamera') {
					scene.remove(child);
				}

				// css2DRenderer.innerHtml
				const label_types = new Set(['navigation_label', 'tooltip']);
				if (label_types.has(child?.name)) {
					scene.remove(child);
				}
			}
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

	// VR Events
	useEffect(() => {
		// Add VR event listeners
		if (isOculusDevice) {
			const {
				addThreeEditorVREventListeners,
				removeThreeEditorVREventListeners,
			} = threeEditorVREvents(
				sceneRef,
				vrControlsRef,
				vrGripControlsRef,
				vrHandsRef,
				cameraRef,
				props.onMouseUp,
				showOnlyHands,
			);

			addThreeEditorVREventListeners();
		}

		return () => {
			if (isOculusDevice) removeThreeEditorVREventListeners();
		};
	}, [sceneRef, vrControlsRef]);

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
			css2DRenderer.setSize(width, height);

			if (UI) setUI(false); //destroy UI
		};

		window.addEventListener('resize', windowResizeHandler);
		return () => {
			window.removeEventListener('resize', windowResizeHandler);
		};
	}, [UI]);

	const clearRoom = () => {
		// Renderer
		const rendererKey = getRendererKey(type, sceneId);
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
		}
		rendererRef.current = null;
		// Controls
		controlsRef.current?.dispose();
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

	const onBackgroundReady = () => {
		setShowLoadingIcon(false);
		setRenderObjects(true);
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
					renderObjects &&
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
							onBackgroundReady={onBackgroundReady}
						/>
					</>
				)}

				{showLoadingIcon && <LoadingIcon src={loadingIconSrc} />}

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
