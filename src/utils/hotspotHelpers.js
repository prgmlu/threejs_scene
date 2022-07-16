import { HotspotMarker } from '../Hotspot/_constructors';

const createHotspotMarker = ({
	imageURL,
	imageHoverURL,
	iconConfig,
	userData = {},
	UIConfig,
	onClick,
	animation,
	transform,
}) => {
	return new HotspotMarker({
		iconConfig,
		imageURL,
		imageHoverURL,
		userData,
		UIConfig,
		onClick,
		animation,
		transform,
	});
};

export const createAndRenderHotspotMarkerOnEvent = (e, data, point, scene) => {
	//#1. Create
	const newMarker = createHotspotMarker({
		userData: data.userData,
		UIConfig: data.UIConfig,
		animation: data.animation,
	});

	//#2. Add to the scene
	newMarker.addToScene(scene);

	//#3. Config
	newMarker.setScale();
	newMarker.setPosition(point.x, point.y, point.z);

	//#4. open UI
	newMarker.onClick(e);
	return newMarker;
};

/**
 * Renders marker from stored hotspot record {}
 * @param object - scene object
 * @param sceneRef
 * @returns {HotspotMarker}
 */
export const renderHotspotRecord = (object = {}, sceneRef) => {
	//1. Create
	const marker = createHotspotMarker({
		userData: object.userData,
		UIConfig: object.UIConfig,
		iconConfig: object.iconConfig,
		imageURL: object.imageURL,
		onClick: object.onClick,
		animation: object.animation,
		imageHoverURL: object.imageHoverURL,
		transform: object.transform,
	});

	//2.Add
	marker.addToScene(sceneRef.current);

	//3. config
	marker.setTransform(object.collider_transform, object.transform);

	return marker;
};
