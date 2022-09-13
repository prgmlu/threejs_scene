import { Vector3, Matrix4 } from 'three';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const DEFAULT_HAND_PROFILE_PATH = 'https://cdn.jsdelivr.net/npm/@webxr-input-profiles/assets@1.0/dist/profiles/generic-hand/';

export const threeEditorVREvents = (
	sceneRef,
    vrControlsRef,
    vrGripControlsRef,
    vrHandsRef,
	cameraRef,
	onMouseUpCallback,
    showOnlyHands,
) => {
	

    const raycaster = new THREE.Raycaster();
    const tempMatrix = new Matrix4();
    const loader = new GLTFLoader().setPath(DEFAULT_HAND_PROFILE_PATH);

    const getIntersections=(controller, sceneRef)=>{
        
        tempMatrix.identity().extractRotation( controller.matrixWorld );

        raycaster.ray.origin.setFromMatrixPosition( controller.matrixWorld );
        raycaster.ray.direction.set( 0, 0, - 1 ).applyMatrix4( tempMatrix );

        // Three js has issues raycasting sprites, those and cameraRef are removed for now
        const targets = sceneRef.children.filter(e=> e.type !== 'PerspectivecameraRef' && e.type !== 'Sprite');

        return raycaster.intersectObjects( targets , false );
    }

    const onSelectStart=(event, sceneRef, onMouseUpCallback, cameraRef, controller)=>{
        
        const control = event.target;
        control.children[0].scale.z = 100;
        control.userData.selectPressed = true;
        handleHapticFeedback(event, controller);

        const intersections = getIntersections( control, sceneRef );

        if ( intersections.length > 0 ) {
            const intersection = intersections[ 0 ];
            const sceneRefObject = intersection.object.name === 'marker';
            const object = intersection.object;
            object.material.opacity = 1; // Make the object visible for now
            control.userData.selected = object;
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

    const addHandModel=(controller, handedness)=>{

        const controllerChildren = [...controller.children];
        
        const hand = controllerChildren.find(child => child.name === 'VR3DHand' )

        if(hand){
            hand.visible = true;
        }else{
            loader.load(`${handedness}.glb` ,
                (hand) =>{
                    hand.scene.name = 'VR3DHand'
                    hand.scene.rotation.x += THREE.MathUtils.degToRad(90)
                    controller.add(hand.scene)
                }, null,
                (error)=>{
                }			
            )
        }
    }

    const hideHand=(controller)=>{
        const controllerChildren = [...controller.children];

        const hand = controllerChildren.find(child => child.name === 'VR3DHand' )

        if (hand) hand.visible = false;

    }

    // Haptic Feedback is the control vibration when a button is clicked on.
    const handleHapticFeedback = (event, controller)=>{
        const gamepad = event.data.gamepad;
        const supportHaptic = 'hapticActuators' in gamepad && gamepad.hapticActuators != null && gamepad.hapticActuators.length > 0;
        
        if(supportHaptic && event.data.handedness == controller.name ){
            gamepad.hapticActuators[0].pulse(0.3, 100);
        }
    }
	
    // Add Event Listeners
    const addThreeEditorVREventListeners = () =>{
        vrControlsRef.current.forEach((controller, index)=>{
            controller.addEventListener('selectstart', (event)=>{
                onSelectStart(event, sceneRef.current, onMouseUpCallback, cameraRef, controller);
            });
            controller.addEventListener('selectend', (event)=>{
                onSelectEnd(event, sceneRef.current, onMouseUpCallback, cameraRef);
            });
            controller.addEventListener('connected', (event)=>{
                controller.name = event.data.handedness;
            })
            if(showOnlyHands){
                controller.addEventListener('connected', (event)=>{
                    const xrHand = event.data.hand;
                    const handedness = event.data.handedness;
                    if(!xrHand){
                        addHandModel(controller, handedness);
                    }else{
                        hideHand(controller);
                    }
                })  
                controller.addEventListener('disconnected', (event)=>{ })  
            }
        })
        vrGripControlsRef.current.forEach(gripControl=>{
            // To get info about keys, we can map specific functions to buttons
            gripControl.addEventListener("connected", (event) => { })
        })
        vrHandsRef.current.forEach(hand=>{
            // To perform an action when the user pinches with the hands
            hand.addEventListener("connected", (event) => { 
                if(showOnlyHands){
                    
                }
            })
            hand.addEventListener('disconnected', (event)=>{ })
            hand.addEventListener("pinchend", (event) => { })
        })
    }

    // Remove event listeners
    const removeThreeEditorVREventListeners = () =>{
        vrControlsRef.current.forEach(controller=>{
            controller.removeEventListener('selectstart', (event)=>{
                onSelectStart(event, sceneRef.current, onMouseUpCallback, cameraRef, controller);
            });
            controller.removeEventListener('selectend', (event)=>{
                onSelectEnd(event, sceneRef.current, onMouseUpCallback, cameraRef);
            });
            controller.removeEventListener('connected', (event)=>{
                controller.name = event.data.handedness;
            });
            if(showOnlyHands){
                controller.removeEventListener('connected', (event)=>{
                    const xrHand = event.data.hand;
                    if(!xrHand){
                        addHandModel(controller, index);
                    }else{
                        hideHand(controller);
                    }
                })  
                controller.removeEventListener('disconnected', (event)=>{  })  
            }
            
        })
        vrGripControlsRef.current.forEach(gripControl=>{
            // To get info about keys, we can map specific functions to buttons
            gripControl.removeEventListener("connected", (event) => { })
        })
        vrHandsRef.current.forEach(hand=>{
            // To perform an action when the user pinches with the hands
            hand.removeEventListener("connected", (event) => { 
                if(showOnlyHands){
                    
                }
            })
            hand.addEventListener('disconnected', (event)=>{ })
            hand.removeEventListener("pinchend", (event) => { });
        })
    }
	
	return {
		addThreeEditorVREventListeners,
		removeThreeEditorVREventListeners
	};
};
