import {HotspotMarker} from "../three-base-components/Markers";


/**
 * Renders marker from stored hotspot record {}
 * @param object - scene object
 * @param sceneRef
 * @returns {HotspotMarker}
 */
export const renderHotspotRecord = (object={}, sceneRef) => {
    const marker = new HotspotMarker({
        userData:object.userData,
        UIConfig:object.UIConfig
        // UIConfig:{
        //     Component:HotspotMarkerUIForm,
        //     positionNextToTheElement:true,
        //     style:{background:'none'}
        // }
    });


    marker.addToScene(sceneRef.current);
    marker.setTransform(object.collider_transform, object.transform);
    marker.setScale();

    return marker;
};