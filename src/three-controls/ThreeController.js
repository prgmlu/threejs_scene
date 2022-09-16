import * as THREE from 'three';
import OrbitControls from './OrbitControls';
import { XRControllerModelFactory } from 'three/examples/jsm/webxr/XRControllerModelFactory';
import { OculusHandModel } from 'three/examples/jsm/webxr/OculusHandModel';
import CharacterControls from './CharacterControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { ANIMATION_NAMES } from './Constants';



class ThreeController {
	setupControls(camera, renderer, orbitControlsConfig, scene, model) {
		this.startDistance = null;
		this.camera = camera;
		this.scene = scene;
		this.renderer = renderer;
		this.model = model;

		this.controls = new OrbitControls(
			this.camera,
			renderer.domElement,
			orbitControlsConfig,
		);


		window.c = this.controls;
		// this.controls.enableDamping = true;
		// this.controls.dampingFactor = 0.05;
		// this.controls.enableKeys = false;
		// this.controls.enableZoom = true;
		this.controls.maxDistance = 0.1;
		this.controls.minDistance = 0;

		return this.controls;
	}

	setupPanControls(enablePan = false) {
		if (enablePan) {
			this.controls.enablePan = true;
			this.controls.enableRotate = false;
			this.controls.panSpeed = 75.0;
			this.controls.screenSpacePanning = true;
			this.controls.touches.ONE = THREE.TOUCH.PAN;
		}
		// this.controls.mouseButtons.LEFT = THREE.MOUSE.PAN;
		// this.controls.mouseButtons.RIGHT = THREE.MOUSE.DOLLY;
		return this.controls;
	}


	setupCharacterControls(models, charMixers, animationsMaps, storeMixer, directionValues,localAvatarNameRef,localAvatarOutfitStringRef, scene, camera) {
        this.controls.minDistance = 2;
        this.controls.maxDistance = 6;
        this.controls.enablePan = false;
        this.controls.maxPolarAngle = Math.PI / 2 - 0.05;

        // this.controls.minPolarAngle = - Math.PI / 2 - 0.05;

		this.characterControls = new CharacterControls(models, charMixers, animationsMaps, this.controls, this.camera, ANIMATION_NAMES['idle'],null, [], true, true ,false,storeMixer,directionValues,localAvatarNameRef,localAvatarOutfitStringRef, scene);
		// this.characterControls = new CharacterControls(model, charMixer, animationsMap, this.controls, this.camera, 'Idle',null, [], true, false );

        return this.characterControls;
    }
    
    setupVRControls(renderer, scene, showOnlyHands){

        const controllerModelFactory = new XRControllerModelFactory();

        const geometry = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(0,0,0),
            new THREE.Vector3(0,0,-1)
        ]);

        // This is a temporary helper line to let the user aim at the objects in scene
        const line = new THREE.Line(geometry);
        line.name = 'line';
        line.scale.z = 0;

        const vrControllers = []; // We return an arra for the 2 controllers
        const gripControls = [];
		const vrHands = [];
		const handsModels = [];

        for(let i=0; i<=1; i++){

            // Used for pointing in Z axis. Returns a THREEJS group
            const controller = renderer.xr.getController(i);
			
            controller.add(line.clone());
            controller.userData.selectPressed = false;
            scene.add(controller);
            
            vrControllers.push(controller);

            if(!showOnlyHands){
				// Used to manipulate objects in the 3D space with the controller. Returns a THREEJS group, these are the visual controllers
				const grip = renderer.xr.getControllerGrip(i);
				grip.add(controllerModelFactory.createControllerModel(grip))
				scene.add(grip);

				gripControls.push(grip);
			}

			// Hands
			const hand = renderer.xr.getHand(i);
			const model = new OculusHandModel( hand );
			hand.add(model);
			handsModels.push(model);
			scene.add(hand);

			vrHands.push(hand);
        }

		this.raycaster = new THREE.Raycaster();

        return {vrControllers, gripControls, vrHands, handsModels};
    }
}

export default new ThreeController();
