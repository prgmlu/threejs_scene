import React, { useState, useEffect, useRef } from 'react';
import AnimationMarker from './_constructors/AnimationMarker'
import PropTypes from 'prop-types';
import {
	createAndRenderHotspotMarkerOnEvent,
	renderHotspotRecord,
	renderImageHotspotRecord,
	createAndRenderImageHotspot,
	createAndRenderLabel,
} from '../utils';
import Object3dMarker from './_constructors/Object3dMarker';

const createAndRenderAnimatedHotspot = (props, sceneRef, point, isNewRecord) => {
	//1. Create Animation Marker
	const marker = new AnimationMarker({
		...props,
		clickPoint: isNewRecord && point
	});

	//2. Render Marker
	marker.addToScene(sceneRef.current);

	return marker;
};


//TODO: refactor setMaxRenderOrder
//TODO: object with hotspot_type =='image_marker' has prop sceneObject == null???
const Hotspot = (props) => {
	const {
		type,
		transform,
		collider_transform,
		sceneRef,
		setMaxRenderOrder,
		userData,

		// accessibility
		onAccessibilityMarkerClicked,
		activeNavIndex,
		navMarkerIndex,
		activeHotspotIndex,
		hotspotMarkerIndex,
		camera,
	} = props;

	let hotspot_type = userData?.props?.hotspot_type;
	const markerRef = useRef();

	useEffect(() => {
		const isNewRecord = !!(
			transform === undefined ||
			collider_transform === undefined ||
			transform?.length < 1 ||
			collider_transform?.length < 1
		);
		const { e, point } = sceneRef.current.userData?.clickData || {};

		// animation Hotspot
		if (type === 'HotspotMarker' && hotspot_type === 'animation') {
			// debugger;
			markerRef.current = createAndRenderAnimatedHotspot(
				props,
				sceneRef,
				point,
				isNewRecord,
			)
		}

		if (type === 'HotspotMarker' && hotspot_type !== 'animation') {
			//new markers has no transform values. Currently interpreted as a new record
			if (isNewRecord) {
				markerRef.current = createAndRenderHotspotMarkerOnEvent(
					e,
					props,
					point,
					sceneRef.current,
				);
			} else {
				markerRef.current = renderHotspotRecord(props, sceneRef);
			}
		}

		// Image Hotspot
		else if (type === 'image_hotspot') {
			if (isNewRecord) {
				markerRef.current = createAndRenderImageHotspot(
					props,
					sceneRef,
					point,
				);
			} else {
				markerRef.current = renderImageHotspotRecord(
					props,
					sceneRef,
					setMaxRenderOrder,
				);
			}
		} else if (type === 'Label') {
			markerRef.current = createAndRenderLabel(sceneRef, props);
		} else if (type === '3d_model') {
			const marker = new Object3dMarker(props);
			marker.addToScene(sceneRef.current);
			markerRef.current = marker;
		}

		return () => {
			markerRef.current?.dispose();
			markerRef.current?.components?.map((item) => item.dispose());
			markerRef.current?.sceneObject?.dispose();
		};
	}, []);

	const onEnterPressAccessibilityEvent = (e) => {
		if (e.key !== 'Enter') return;
		if (navMarkerIndex !== activeNavIndex) return;
		if (hotspotMarkerIndex !== activeHotspotIndex) return;
		e.preventDefault();
		e.stopPropagation();
		onAccessibilityMarkerClicked(
			e,
			undefined,
			markerRef.current,
			undefined,
		);
	};

	const highlightMarker = (marker) => {
		if (
			navMarkerIndex === activeNavIndex &&
			marker.userData.type === 'NavMarker'
		) {
			marker.onHover();
		} else if (
			hotspotMarkerIndex === activeHotspotIndex &&
			marker.userData.type === 'HotspotMarker'
		) {
			marker.onHover();
		} else {
			marker.onUnhover();
		}
	};

	useEffect(() => {
		if (type === 'HotspotMarker') {
			highlightMarker(markerRef.current);
		}
		document.addEventListener('keyup', onEnterPressAccessibilityEvent);

		return () => {
			document.removeEventListener(
				'keyup',
				onEnterPressAccessibilityEvent,
			);
		};
	}, [activeNavIndex, activeHotspotIndex]);

	return false;
};

Hotspot.defaultProps = {
	type: 'hotspot', //hotspot/image_hotspot
};

Hotspot.propTypes = {
	type: PropTypes.string.isRequired,
	collider_transform: PropTypes.array,
	transform: PropTypes.array,
	userData: PropTypes.object,
	UIConfig: PropTypes.shape({
		// Component: PropTypes.object.isRequired,
		style: PropTypes.object,
		positionNextToTheElement: PropTypes.bool,
	}),
};

export default Hotspot;
