import { Vector3, Matrix4 } from 'three';
import * as THREE from 'three';

export const threeEditorVREvents = (
	sceneRef,
    vrControlsRef,
    vrGripControlsRef,
	cameraRef,
	onMouseUpCallback,
) => {
	

    const raycaster = new THREE.Raycaster();
    const tempMatrix = new Matrix4();

    const getIntersections=(controller, sceneRef)=>{
        
        tempMatrix.identity().extractRotation( controller.matrixWorld );

        raycaster.ray.origin.setFromMatrixPosition( controller.matrixWorld );
        raycaster.ray.direction.set( 0, 0, - 1 ).applyMatrix4( tempMatrix );

        // Three js has issues raycasting sprites, those and cameraRef are removed for now
        const targets = sceneRef.children.filter(e=> e.type !== 'PerspectivecameraRef' && e.type !== 'Sprite');

        return raycaster.intersectObjects( targets , false );
    }

    const onSelectStart=(event, sceneRef, onMouseUpCallback, cameraRef)=>{
        
        const controller = event.target;
        controller.children[0].scale.z = 100;
        controller.userData.selectPressed = true;

        const intersections = getIntersections( controller, sceneRef );

        if ( intersections.length > 0 ) {
            const intersection = intersections[ 0 ];
            const sceneRefObject = intersection.object.name === 'marker';
            const object = intersection.object;
            object.material.opacity = 1; // Make the object visible for now
            controller.userData.selected = object;
        }
    }

    const onSelectEnd=(event, sceneRef, onMouseUpCallback, cameraRef)=>{

        const controller = event.target;

        if(controller.userData.selectPressed){
            const intersections = getIntersections( controller, sceneRef );
            if ( intersections.length > 0 ) {
                const intersection = intersections[ 0 ];
                const sceneRefObject = intersection.object.name === 'marker'; // Only for hotspots, nav hotspots for now
                const object = intersection.object
                object.material.opacity = 0; 
                const marker = object?.owner;
                if (onMouseUpCallback){
                    onMouseUpCallback(event, sceneRefObject, marker);
                }
                controller.children[0].scale.z = 0;
                controller.userData.selectPressed = false;
                controller.userData.selected = null;
            }
        }
    }

	
    // Add Event Listeners
    const addThreeEditorVREventListeners = () =>{
        vrControlsRef.current.forEach(controller=>{
            controller.addEventListener('selectstart', (event)=>{
                onSelectStart(event, sceneRef.current, onMouseUpCallback, cameraRef);
            });
            controller.addEventListener('selectend', (event)=>{
                onSelectEnd(event, sceneRef.current, onMouseUpCallback, cameraRef);
            });
        })
        vrGripControlsRef.current.forEach(gripControl=>{
            // To get info about keys, we can map specific functions to buttons
            gripControl.addEventListener("connected", (e) => { })
        })
    }

    // Remove event listeners
    const removeThreeEditorVREventListeners = () =>{
        vrControlsRef.current.forEach(controller=>{
            controller.removeEventListener('selectstart', (event)=>{
                onSelectStart(event, sceneRef.current, onMouseUpCallback, cameraRef);
            });
            controller.removeEventListener('selectend', (event)=>{
                onSelectEnd(event, sceneRef.current, onMouseUpCallback, cameraRef);
            });
        })
        vrGripControlsRef.current.forEach(gripControl=>{
            // To get info about keys, we can map specific functions to buttons
            gripControl.removeEventListener("connected", (e) => { })
        })
    }
	
	return {
		addThreeEditorVREventListeners,
		removeThreeEditorVREventListeners
	};
};
