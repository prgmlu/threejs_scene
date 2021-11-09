import { Vector3, Matrix4 } from 'three';
import * as THREE from 'three';



export const threeEditorMouseEvents = (
    sceneRef,
    renderer,
    controlsRef,
    cameraRef,
    canvasContainer,
    allowEventsForMarkerTypeOnly,
    allowHotspotsToMove=true,
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
    const mouseStart = new THREE.Vector2();

    const raycaster = new THREE.Raycaster();


    const setMousePosition = (refToUpdate, e, isMobileEvent) => {
        const canvasDimensions = renderer.domElement.getBoundingClientRect();
        let x;
        let y;

        if(isMobileEvent){
            const clientX = e.touches[0].pageX;
            const clientY = e.touches[0].pageY;
            x = ((clientX - canvasDimensions.left) / canvasDimensions.width) * 2 - 1;
            y = -((clientY - canvasDimensions.top) / canvasDimensions.height) * 2 + 1;
        }else{
            const {top, left, width, height} = canvasDimensions;
            x = -1 + 2 * (e.clientX - left) / width; // eslint-disable-line
            y = 1 - 2 * (e.clientY - top) / height; // eslint-disable-line
        }

        refToUpdate.x = x;
        refToUpdate.y = y;
        return { x, y, canvasDimensions }
    };

    const getMousePosition = () => {
        return mouseRef;
    }

    const getIntersectedMarkerObject=(intersects)=>{
        return intersects.find((intersect) => {
            const markerType = intersect?.object?.owner?.hotspot_type;
            //apply extra filter
            if(allowEventsForMarkerTypeOnly && markerType) return markerType === allowEventsForMarkerTypeOnly && intersect.object.name === 'marker';

            return intersect.object.name === 'marker';
        });
    }

    /**
     * onMouseDown Scene Event
     * @param e
     * Note: currently returns marker object that selected based on provided parameters.
     * In future, we may need/want to access intersection objects [] from provided callback function,
     * But I would recommend to avoid it if possible and keep computation of selected marker as part of the code.
     */
    const onMouseDownTouchStartEvent = (e) => {
        const isTouchEvent = e.type == "touchstart";
        const mousePos = setMousePosition(mouseStart, e, isTouchEvent);
        raycaster.setFromCamera(mouseStart, cameraRef.current);
        const intersects = raycaster.intersectObjects(sceneRef.current.children);
        const marker = getIntersectedMarkerObject(intersects);


        if (marker) {
            isMarkerClicked = true;
            controlsRef.current.enabled = false; //eslint-disable-line
            focusedObject = marker.object;
            const { point } = marker;
            //TODO: describe what it does?
            if(!focusedObject?.parent) console.error('Prop Not Found');
            if(focusedObject?.parent) inverseMatrix.copy(focusedObject.parent.matrixWorld).getInverse(inverseMatrix);
            offset.copy(point).sub(worldPosition.setFromMatrixPosition(focusedObject.matrixWorld));
        }

        //Public interface
        if(onMouseDownCallback)  onMouseDownCallback(e, marker, mousePos);
    };



    const onMouseUpTouchEndEvent = (e) => {
        // console.log('-onMouseUp', {e});
        const isMobileEvent = e.type == "touchend";
        if (isMobileEvent && e.touches.length < 1) e.preventDefault();

        if(!isMobileEvent) setMousePosition(mouseRef, e, isMobileEvent);
        controlsRef.current.enabled = true; //eslint-disable-line

        const dragDistance = mouseRef.distanceTo(mouseStart);
        raycaster.setFromCamera(mouseRef, cameraRef.current);
        const intersects = raycaster.intersectObjects(sceneRef.current.children);
        const isDragEvent = (dragDistance > DESKTOP_THRESHOLD);

        const markerIntersection = getIntersectedMarkerObject(intersects);
        const sceneObject = markerIntersection?.object;

        //reset data
        if (dragDistance > DESKTOP_THRESHOLD) {
            if (isMarkerClicked) isMarkerClicked = false;
        }else{
            isMarkerClicked = false;
        }

        //Find underlying scene background object
        const bgObject = intersects.find(item=> ['cubeBackground', 'flatBackground'].includes(item.object.name));
        const point = bgObject.point;

        //save clickData
        sceneRef.current.userData.clickData = {e, point};

        //Get transforms
        const marker = sceneObject?.owner;
        if(marker) marker.transforms = marker.getTransforms();

        // public method/callback
        if(onMouseUpCallback)  return onMouseUpCallback(e, sceneObject, marker,  isDragEvent);
    };








    const onMouseMove = (e) => {
        const isMobileEvent = e.touches?.length > 0;
        // console.log('%c __onMouseMove__', 'color:red', {e, focusedObject, isMarkerClicked});


        //update for mobile events
        if(isMobileEvent && focusedObject) setMousePosition(mouseRef, e, true);

        //call public callback
        if(onMouseMoveCallback) onMouseMoveCallback(e, focusedObject, isMarkerClicked);

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
             setMousePosition(mouseRef, e, isMobileEvent);
            raycaster.setFromCamera(mouseRef, cameraRef.current);

            const intersects = raycaster.intersectObjects(sceneRef.current.children);
            const sceneObject = intersects.find(item=> ['cubeBackground', 'flatBackground'].includes(item.object.name));
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
        renderer.domElement.addEventListener('mousedown', onMouseDownTouchStartEvent);
        renderer.domElement.addEventListener('mouseup', onMouseUpTouchEndEvent,  { passive: true });
        renderer.domElement.addEventListener('contextmenu', preventContextMenu);
        renderer.domElement.addEventListener('mousemove', onMouseMove);
        renderer.domElement.addEventListener('wheel', mouseWheelHandler, { passive: true });

        //Mobile
        renderer.domElement.addEventListener('touchstart', onMouseDownTouchStartEvent);
        renderer.domElement.addEventListener('touchmove', onMouseMove);
        renderer.domElement.addEventListener('touchend', onMouseUpTouchEndEvent);
    };

    const removeThreeEditorMouseEventListeners = () => {
        renderer.domElement.removeEventListener('mousedown', onMouseDownTouchStartEvent);
        renderer.domElement.removeEventListener('mouseup', onMouseUpTouchEndEvent);
        renderer.domElement.removeEventListener('contextmenu', preventContextMenu);
        renderer.domElement.removeEventListener('mousemove', onMouseMove);
        renderer.domElement.removeEventListener('wheel', mouseWheelHandler);

        //Mobile
        renderer.domElement.removeEventListener('touchstart', onMouseDownTouchStartEvent);
        renderer.domElement.removeEventListener('touchmove', onMouseMove);
        renderer.domElement.removeEventListener('touchend', onMouseUpTouchEndEvent);
    };

    return {
        addThreeEditorMouseEventListeners,
        removeThreeEditorMouseEventListeners,
    };
};
