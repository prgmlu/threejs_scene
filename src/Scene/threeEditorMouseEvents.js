import { Vector3, Matrix4 } from 'three';
import * as THREE from 'three';



export const threeEditorMouseEvents = (
    sceneRef,
    renderer,
    controlsRef,
    cameraRef,
    canvasContainer,
    allowEventsForMarkerTypeOnly,
    onMouseDownCallback,
    onMouseUpCallback,
    onMouseMoveCallback
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
    const mouseRef = new THREE.Vector2();
    const mouseStartRef = new THREE.Vector2();

    const raycaster = new THREE.Raycaster();

    const setMousePosition = (refToUpdate, e) => {
        const canvasDimensions = renderer.domElement.getBoundingClientRect();
        const {top, left, width, height} = canvasDimensions;
        const x = -1 + 2 * (e.clientX - left) / width; // eslint-disable-line
        const y = 1 - 2 * (e.clientY - top) / height; // eslint-disable-line
        // console.log('>setMousePosition', {top, left, width, height, x, y});

        refToUpdate.x = x;
        refToUpdate.y = y;
        return { x, y, canvasDimensions }
    };

    const getMousePosition = () => {
        return mouseRef;
    }

    /**
     * onMouseDown Scene Event
     * @param e
     * Note: currently returns marker object that selected based on provided parameters.
     * In future, we may need/want to access intersection objects [] from provided callback function,
     * But I would recommend to avoid it if possible and keep computation of selected marker as part of the code.
     */
    const onMouseDown = (e) => {
        const mousePos = setMousePosition(mouseStartRef, e);
        raycaster.setFromCamera(mouseStartRef, cameraRef.current);
        const intersects = raycaster.intersectObjects(sceneRef.current.children);

        //
        const marker = intersects.find((intersect) => {
            const markerType = intersect?.object?.owner?.hotspot_type;
            //apply extra filter
            if(allowEventsForMarkerTypeOnly && markerType) return markerType === allowEventsForMarkerTypeOnly;
            //or return any type of marker
            return intersect.object.name === 'marker';
        });

        // console.log('-onMouseDown', {allowEventsForMarkerTypeOnly,   marker, markerType: marker?.object?.owner?.hotspot_type});

        if (marker) {
            isMarkerClicked = true;
            controlsRef.current.enabled = false; //eslint-disable-line
            focusedObject = marker.object;
            const { point } = marker;
            //TODO: what it does?
            if(!focusedObject?.parent) console.error('Prop Not Found');
            if(focusedObject?.parent) inverseMatrix.copy(focusedObject.parent.matrixWorld).getInverse(inverseMatrix);
            offset.copy(point).sub(worldPosition.setFromMatrixPosition(focusedObject.matrixWorld));
        }

        //Public interface
        if(onMouseDownCallback)  onMouseDownCallback(e, marker, {mousePos});
    };



    const onMouseUp = (e) => {
        setMousePosition(mouseRef, e);
        controlsRef.current.enabled = true; //eslint-disable-line

        const dragDistance = mouseRef.distanceTo(mouseStartRef);
        raycaster.setFromCamera(mouseRef, cameraRef.current);
        const intersects = raycaster.intersectObjects(sceneRef.current.children);
        const isDragEvent = (dragDistance > DESKTOP_THRESHOLD);



        const markerIntersection = intersects.find((intersect) => {
            const markerType = intersect?.object?.owner?.hotspot_type;
            //apply extra filter
            if(allowEventsForMarkerTypeOnly && markerType) return markerType === allowEventsForMarkerTypeOnly && intersect.object.name === 'marker';

            return intersect.object.name === 'marker';
        });
        const marker = markerIntersection?.object;

        //reset data
        if (dragDistance > DESKTOP_THRESHOLD) {
            if (isMarkerClicked) isMarkerClicked = false;
        }else{
            isMarkerClicked = false;
        }

        // public method/callback
        if(onMouseUpCallback)  return onMouseUpCallback(e, marker, sceneRef.current, intersects, {DESKTOP_THRESHOLD, dragDistance, isDragEvent });
    };








    const onMouseMove = (e) => {
        // const mousePosition = getMousePosition(mouseRef, e);
        // console.log('%c __onMouseMove__', 'color:red', {focusedObject, isMarkerClicked});
        //public callback/interface
        if(onMouseMoveCallback) onMouseMoveCallback(e, focusedObject, isMarkerClicked);

        if (focusedObject && isMarkerClicked) {
            moveFocusedObject(e);
        } else if (focusedObject) {
            focusedObject = null;
        }
    };

    //TODO: move hotspot_type specific computation on the upper user level
    const moveFocusedObject = (e) => {

        if (focusedObject) {
            setMousePosition(mouseRef, e);
            raycaster.setFromCamera(mouseRef, cameraRef.current);

            const intersects = raycaster.intersectObjects(sceneRef.current.children);
            const sceneObject = intersects.find(item=> ['BackgroundCube', 'flatBackground'].includes(item.object.name));
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
        const temp = cameraRef.current.fov + (fovDelta * 0.05);

        if (temp > MIN_ZOOM_FOV && temp < MAX_ZOOM_FOV) {
            cameraRef.current.fov = temp; // eslint-disable-line
            cameraRef.current.updateProjectionMatrix();
        }
    };






    // 2 main functions of event listeners
    const addThreeEditorMouseEventListeners = () => {
        renderer.domElement.addEventListener('mousedown', onMouseDown);
        renderer.domElement.addEventListener('mouseup', onMouseUp,  { passive: true });
        renderer.domElement.addEventListener('contextmenu', preventContextMenu);
        renderer.domElement.addEventListener('mousemove', onMouseMove);
        renderer.domElement.addEventListener('wheel', mouseWheelHandler, { passive: true });
    };

    const removeThreeEditorMouseEventListeners = () => {
        renderer.domElement.removeEventListener('mousedown', onMouseDown);
        renderer.domElement.removeEventListener('mouseup', onMouseUp);
        renderer.domElement.removeEventListener('contextmenu', preventContextMenu);
        renderer.domElement.removeEventListener('mousemove', onMouseMove);
        renderer.domElement.removeEventListener('wheel', mouseWheelHandler);
    };

    return {
        addThreeEditorMouseEventListeners,
        removeThreeEditorMouseEventListeners,
    };
};
