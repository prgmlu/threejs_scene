import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import {
	createAndRenderHotspotMarkerOnEvent,
	renderHotspotRecord,
	renderImageHotspotRecord,
	createAndRenderImageHotspot,
} from '../utils';

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
		onMouseUp,
		activeNavIndex,
		navMarkerIndex,
		activeHotspotIndex,
		hotspotMarkerIndex,
		accessibilityHighlightColor,
	} = props;


	const markerRef = useRef();

	useEffect(() => {
		const isNewRecord = !!(
			transform === undefined ||
			collider_transform === undefined ||
			transform?.length < 1 ||
			collider_transform?.length < 1
		);
		const { e, point } = sceneRef.current.userData?.clickData || {};

		if (type === 'hotspot') {
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
		}

		return () => {
			markerRef.current.dispose();
			markerRef.current.components?.map((item) => item.dispose());
			markerRef.current.sceneObject?.dispose();
		};
	}, []);

	const onEnterPressAccessibilityEvent = (e) => {
		if (e.key !== 'Enter') return;
		if (navMarkerIndex !== activeNavIndex) return;
		if (hotspotMarkerIndex !== activeHotspotIndex) return;
		e.preventDefault();
		e.stopPropagation();
		onMouseUp(e, undefined, markerRef.current, undefined);
	}
	
	const highlightMarker = (marker) => {
		if (!marker.svgSpriteComponent.svgString) return;
		if (navMarkerIndex === activeNavIndex && marker.userData.type === 'NavMarker') {
			marker.svgSpriteComponent.setColor(accessibilityHighlightColor);
		} else if (hotspotMarkerIndex === activeHotspotIndex && marker.userData.type === 'HotspotMarker') {
			marker.svgSpriteComponent.setColor(accessibilityHighlightColor);
		} else {
			marker.svgSpriteComponent.setColor(marker.primaryColor);
		}
	}

	useEffect(() => {
		highlightMarker(markerRef.current);
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
