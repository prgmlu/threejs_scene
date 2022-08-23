import { Vector3, Matrix4 } from 'three';
import * as THREE from 'three';

export const threeEditorMouseEvents = (
	sceneRef,
	renderer,
	controlsRef,
	cameraRef,
	canvasContainer,
	allowEventsForMarkerTypeOnly,
	allowHotspotsToMove = true,
	onMouseDownCallback,
	onMouseUpCallback,
	onMouseMoveCallback,
) => {
	const DESKTOP_THRESHOLD = 0.005;
	const MIN_ZOOM_FOV = 20;
	const MAX_ZOOM_FOV = 70;
	const offset = new Vector3();
	const worldPosition = new Vector3();
	const inverseMatrix = new Matrix4();

	// reference to the object that is clicked/being dragged
	let isMarkerClicked = false;
	let focusedObject = null;

	//Mouse positions
	const mouseCoord = new THREE.Vector2();
	const mouseStart = new THREE.Vector2();

	const eventMouseStart = new THREE.Vector2();
	const eventMouseEnd = new THREE.Vector2();

	const raycaster = new THREE.Raycaster();
	let hoveredMarker = null;

	const setMousePosition = (refToUpdate, e, isMobileEvent) => {
		const rect = renderer.domElement.getBoundingClientRect();
		const { top, left, width, height } = rect;
		let x;
		let y;
		let clientX = e.clientX;
		let clientY = e.clientY;

		if (isMobileEvent) {
			const eventData =
				e.type === 'touchend' ? e.changedTouches : e.touches;
			//Do not use pageX/pageY here!!!!
			clientX = eventData[0].clientX;
			clientY = eventData[0].clientY;
		}

		x = ((clientX - left) / width) * 2 - 1;
		y = -((clientY - top) / height) * 2 + 1;

		if (!x || !y) console.error('Wrong mouse coordinate computation');

		refToUpdate.set(x, y);
		return { x, y };
	};

	const getMousePosition = () => {
		return mouseCoord;
	};

	const getIntersectedMarkerObject = (intersects) => {
		return intersects.find((intersect) => {
			const markerType = intersect?.object?.owner?.hotspot_type;
			//apply extra filter
			if (allowEventsForMarkerTypeOnly && markerType)
				return (
					markerType === allowEventsForMarkerTypeOnly &&
					intersect.object.name === 'marker'
				);

			return intersect.object.name === 'marker';
		});
	};

	/**
	 * onMouseDown Scene Event
	 * @param e
	 * Note: currently returns marker object that selected based on provided parameters.
	 * In future, we may need/want to access intersection objects [] from provided callback function,
	 * But I would recommend to avoid it if possible and keep computation of selected marker as part of the code.
	 */
	const onMouseDownTouchStartEvent = (e) => {
		const isMobileEvent = e.type === 'touchstart';
		const coord = setMousePosition(eventMouseStart, e, isMobileEvent);
		mouseCoord.set(coord.x, coord.y); //mouseCoord should keep initial click position

		//Public interface
		if (onMouseDownCallback)
			onMouseDownCallback(e, sceneObject, mouseCoord);
	};

	const onMouseUpTouchEndEvent = (e) => {
		const isMobileEvent = e.type === 'touchend';

		if (isMobileEvent) e.preventDefault();
		setMousePosition(eventMouseEnd, e, isMobileEvent);

		controlsRef.current.enabled = true; //eslint-disable-line

		const dragDistance = eventMouseStart.distanceTo(eventMouseEnd);

		const isDragEvent = dragDistance > DESKTOP_THRESHOLD;

		if (isDragEvent) {
			return;
		}

		raycaster.setFromCamera(mouseCoord, cameraRef.current);
		const intersects = raycaster.intersectObjects(
			sceneRef.current.children,
		);

		const sceneObject = getIntersectedMarkerObject(intersects);
		// const sceneObject = markerIntersection?.object;
		// const sceneObject =
		// 	isMarkerClicked && focusedObject ? focusedObject : null;

		if (sceneObject?.object?.owner?.onClick) {
			sceneObject.object?.owner.onClick();
		}
		const marker = sceneObject?.object?.owner;

		// public method/callback
		if (onMouseUpCallback)
			return onMouseUpCallback(e, sceneObject, marker, isDragEvent);
	};

	const resetHovers = () => {
		hoveredMarker?.onUnhover();
		hoveredMarker = null;
	};

	const onMouseMove = (e) => {
		const isMobileEvent = e.type === 'touchmove';

		const coord = setMousePosition(mouseStart, e, isMobileEvent);
		mouseCoord.set(coord.x, coord.y);
		raycaster.setFromCamera(mouseStart, cameraRef.current);

		const intersects = raycaster.intersectObjects(
			sceneRef.current.children,
		);
		const sceneObject = getIntersectedMarkerObject(intersects);
		const marker = sceneObject?.object?.owner;

		// console.log(marker);

		//three cases,
		// 1- new hover, 2- already hovered, 3- no hovers

		// Hovered and marker found
		if (marker) {
			// Marker not same as existing hoveredMarker
			if (hoveredMarker && hoveredMarker !== marker) {
				hoveredMarker.onUnhover();
			}
			// Mark hoveredMarker
			hoveredMarker = marker;
			marker.onHover();
		}

		// No hoveredMarker markers
		if (!marker && hoveredMarker) {
			resetHovers();
		}

		//call public callback
		if (onMouseMoveCallback)
			onMouseMoveCallback(e, focusedObject, isMarkerClicked);

		//move object if any selected
		if (allowHotspotsToMove && focusedObject && isMarkerClicked) {
			moveFocusedObject(e, isMobileEvent);
		} else if (focusedObject) {
			focusedObject = null;
		}
	};

	const moveFocusedObject = (e, isMobileEvent) => {
		// console.log('-moveFocusedObject', {e, isMobileEvent, focusedObject});

		if (focusedObject) {
			raycaster.setFromCamera(mouseCoord, cameraRef.current);

			const intersects = raycaster.intersectObjects(
				sceneRef.current.children,
			);
			const sceneObject = intersects.find((item) =>
				['cubeBackground', 'flatBackground'].includes(item.object.name),
			);
			const { point } = sceneObject;
			const { x, y, z } = point.sub(offset).applyMatrix4(inverseMatrix);
			focusedObject.owner.setPosition(x, y, z);
		}
	};

	const preventContextMenu = (e) => {
		if (e.target.id === 'modal-overlay') {
			e.preventDefault();
			return false;
		}
		return true;
	};

	const mouseWheelHandler = (e) => {
		const fovDelta = e.deltaY;
		const temp = cameraRef.current.fov + fovDelta * 0.05;

		if (temp > MIN_ZOOM_FOV && temp < MAX_ZOOM_FOV) {
			cameraRef.current.fov = temp; // eslint-disable-line
			cameraRef.current.updateProjectionMatrix();
		}
	};

	// 2 main functions of event listeners
	const addThreeEditorMouseEventListeners = () => {
		renderer.domElement.addEventListener(
			'mousedown',
			onMouseDownTouchStartEvent,
		);
		renderer.domElement.addEventListener(
			'mouseup',
			onMouseUpTouchEndEvent,
			{
				passive: true,
			},
		);
		renderer.domElement.addEventListener('contextmenu', preventContextMenu);
		renderer.domElement.addEventListener('mousemove', onMouseMove);
		renderer.domElement.addEventListener('wheel', mouseWheelHandler, {
			passive: true,
		});

		//Mobile
		renderer.domElement.addEventListener(
			'touchstart',
			onMouseDownTouchStartEvent,
		);
		renderer.domElement.addEventListener('touchmove', onMouseMove);
		renderer.domElement.addEventListener(
			'touchend',
			onMouseUpTouchEndEvent,
		);
	};

	const removeThreeEditorMouseEventListeners = () => {
		renderer.domElement.removeEventListener(
			'mousedown',
			onMouseDownTouchStartEvent,
		);
		renderer.domElement.removeEventListener(
			'mouseup',
			onMouseUpTouchEndEvent,
		);
		renderer.domElement.removeEventListener(
			'contextmenu',
			preventContextMenu,
		);
		renderer.domElement.removeEventListener('mousemove', onMouseMove);
		renderer.domElement.removeEventListener('wheel', mouseWheelHandler);

		//Mobile
		renderer.domElement.removeEventListener(
			'touchstart',
			onMouseDownTouchStartEvent,
		);
		renderer.domElement.removeEventListener('touchmove', onMouseMove);
		renderer.domElement.removeEventListener(
			'touchend',
			onMouseUpTouchEndEvent,
		);
	};

	return {
		addThreeEditorMouseEventListeners,
		removeThreeEditorMouseEventListeners,
		resetHovers,
	};
};
