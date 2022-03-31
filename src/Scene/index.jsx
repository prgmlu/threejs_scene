import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
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

function createRenderer() {
	// var renderer = new THREE.WebGLRenderer();
	const ret = window.renderer || new THREE.WebGLRenderer();
	window.renderer = ret;

	//this line just counts how many times we requested createRenderer()
	//and not how many times we initialized ret
	window.renderers ? window.renderers.push(ret) : (window.renderers = [ret]);
	return ret;
}

function createScene() {
	const ret = window.scene || new THREE.Scene();
	window.scene = ret;

	//this line just counts how many times we requested createRenderer()
	//and not how many times we initialized ret
	window.scenes ? window.scenes.push(ret) : (window.scenes = [ret]);
	return ret;
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
		allReduxStoreData,
		dispatch,
	} = props;
	const [threeReady, setThreeReady] = useState(false);
	const [maxRenderOrder, setMaxRenderOrderAction] = useState(1);
	const [UI, setUI] = useState();
	//Scene
	const sceneRef = useRef(createScene());
	const scene = sceneRef.current;

	//Renderer
	const rendererRef = useRef(createRenderer());

	let renderer = rendererRef.current;
	const glContext = renderer?.domElement.getContext('webgl');

	// useRef used to prevent Scene from losing variable references.
	const canvasRef = useRef();
	const cameraRef = useRef();
	const controlsRef = useRef();

	sceneRef.current.setUI = setUI;

	const setMaxRenderOrder = (renderOrder) => {
		if (renderOrder >= maxRenderOrder)
			setMaxRenderOrderAction(renderOrder + 1);
	};

	const animate = (controllerUpdate) => {
		window.animationId = requestAnimationFrame(() =>
			animate(controllerUpdate),
		);

		renderer.render(scene, cameraRef.current);

		if (controllerUpdate) controllerUpdate();
	};

	//1. Mount camera & setup renderer only once!!!
	useEffect(() => {
		console.log(
			'%c >INIT:1 - initThreeJSScene',
			'color:green',
			JSON.parse(JSON.stringify({ rendererRef: rendererRef.current })),
		);
		const canvas = canvasRef.current;
		initThreeJSScene(canvasRef, cameraRef, controlsRef, rendererRef, scene);
		setThreeReady(true);

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
		};

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
			renderer.dispose();
			// renderer.forceContextLoss();//test
			//cameraRef.current.dispose();
		};
	}, []);

	const initRoom = () => {
		console.log('%c >INIT:3 - initRoom', 'color:green');

		renderer.info.autoReset = true;

		// set new reference for cameraRef.current here
		const aspectRatio =
			canvasRef.current.offsetWidth / canvasRef.current.offsetHeight;
		cameraRef.current = new THREE.PerspectiveCamera(
			70,
			aspectRatio,
			0.1,
			1000,
		);
		controlsRef.current = ThreeController.setupControls(
			cameraRef.current,
			renderer,
		);

		//TODO: properly initialize FlatScene.js
		if (bgConf?.isFlatScene) controlsRef.current.enableRotate = false;

		setupCamera(aspectRatio, cameraRef.current);

		window.cancelAnimationFrame(window.animationId);
		animate(controlsRef.current.update);
		console.log('%c >INIT:3 - initRoom:end', 'color:green');
	};

	//New Scene INIT
	useEffect(() => {
		console.log('%c >INIT:2 - sceneView', 'color:green', {
			scene,
			cameraRef,
			controlsRef,
			renderer,
		});
		initRoom();

		return () => {
			renderer.info.autoReset = false;
			renderer.info.memory.textures = 0;
			renderer.info.memory.geometries = 0;
			renderer.renderLists.dispose();
			renderer.info.reset();
			renderer.state.reset();
			controlsRef.current.dispose();

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
			});

			// scene.dispose();
			renderer.dispose();
			setUI(false); //Hide UI Modal when scene changed
		};
	}, [sceneId]);

	//Events
	useEffect(() => {
		const canvasContainer = canvasRef.current;

		// mouse event listeners
		const {
			addThreeEditorMouseEventListeners,
			removeThreeEditorMouseEventListeners,
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

		// keyboard event listeners
		const {
			addThreeEditorKeyboardEvents,
			removeThreeEditorKeyboardEvents,
		} = threeEditorKeyboardEvents(
			controlsRef,
			dispatch,
			allReduxStoreData,
			props.onEnterKeyToSelectNavMarker,
		);

		addThreeEditorMouseEventListeners();
		addThreeEditorKeyboardEvents();

		return () => {
			removeThreeEditorMouseEventListeners();
			removeThreeEditorKeyboardEvents();
		};
	}, [
		sceneId,
		sceneRef,
		cameraRef,
		allowEventsForMarkerTypeOnly,
		allowHotspotsToMove,
		allReduxStoreData,
	]); // eslint-disable-line

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
				id="canvas-wrapper"
				className={'canvas-wrapper'}
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
