import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { createAndRenderHotspotMarkerOnEvent, renderHotspotRecord, renderImageHotspotRecord, createAndRenderImageHotspot } from '../utils';


//TODO: refactor setMaxRenderOrder
//TODO: object with hotspot_type =='image_marker' has prop sceneObject == null???
const Hotspot = (props) => {
    const { type,
            transform,
            collider_transform,
            sceneRef,
            setMaxRenderOrder,
            navMarkerIdx,
            allReduxStoreData,
            userData,
            onEnterKeyToSelectNavMarker,
        } = props;
    // const { currentAccessibilityNavIdx = null } = allReduxStoreData?.accessibility;
    const currentAccessibilityNavIdx = null; // WIP debugging by MT

    const [isNavMarkerActive, setIsNavMarkerActive] = useState(false);

    const markerRef = useRef();

    useEffect(() => {
        const isNewRecord = !!(transform === undefined || collider_transform === undefined || transform?.length < 1 || collider_transform?.length < 1);
        const { e, point } = sceneRef.current.userData?.clickData || {};

        if (type === 'hotspot') {
            //new markers has no transform values. Currently interpreted as a new record
            if (isNewRecord) {
                markerRef.current = createAndRenderHotspotMarkerOnEvent(e, props, point, sceneRef.current);
            } else {
                markerRef.current = renderHotspotRecord(props, sceneRef);
            }
        }

        // Image Hotspot
        else if (type === 'image_hotspot') {
            if (isNewRecord) {
                markerRef.current = createAndRenderImageHotspot(props, sceneRef, point);
            } else {
                markerRef.current = renderImageHotspotRecord(props, sceneRef, setMaxRenderOrder);
            }
        }
        
        return () => {
            markerRef.current.dispose();
            markerRef.current.components?.map((item) => item.dispose());
            markerRef.current.sceneObject?.dispose();
        };
    }, []);

    // useEffect(()=> {
    //     let replacedSvgString;

    //     if (userData.type === 'NavMarker' && navMarkerIdx === currentAccessibilityNavIdx) {
    //         replacedSvgString = markerRef.current.svgSpriteComponent?.svgString.replace(/opacity='\.5'/g,"opacity='.9'");
    //         markerRef.current.svgSpriteComponent.setSVGString(replacedSvgString);
    //         setIsNavMarkerActive(true)
            
    //     } else if (userData.type === 'NavMarker' && currentAccessibilityNavIdx !== undefined && navMarkerIdx !== currentAccessibilityNavIdx) {
    //         replacedSvgString = markerRef.current.svgSpriteComponent?.svgString.replace(/opacity='\.9'/g,"opacity='.5'");
    //         markerRef.current.svgSpriteComponent.setSVGString(replacedSvgString);
    //         setIsNavMarkerActive(false)
    //     }
    // }, [currentAccessibilityNavIdx])

    // useEffect(()=> {
    //     if (userData.type === 'NavMarker') {
    //         document.addEventListener('keyup', (e) => onEnterKeyToSelectNavMarker(e, markerRef.current, isNavMarkerActive));
    //     }

    //     return () => {
    //         if (userData.type === 'NavMarker') {
    //             document.removeEventListener('keyup', onEnterKeyToSelectNavMarker);
    //         }
    //     }

    // }, [isNavMarkerActive])

    return false;
}

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
