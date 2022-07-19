import * as THREE from 'three';
import OrbitControls from './OrbitControls';
import { XRControllerModelFactory } from 'three/examples/jsm/webxr/XRControllerModelFactory';
import { OculusHandModel } from 'three/examples/jsm/webxr/OculusHandModel';
import CharacterControls from './CharacterControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';



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

		if (!window.counter) {
			window.counter = 1;
		} else {
			window.counter += 1;
		}

		if (window.count > 1) {
			renderer.domElement.addEventListener('touchend', (event) => {
				this.startDistance = null;
			});
			renderer.domElement.addEventListener('touchmove', (event) => {
				if (event.touches.length != 1) {
					event.preventDefault();
				}

				if (event.touches.length === 2) {
					var base = Math.abs(
						event.touches[1].pageX - event.touches[0].pageX,
					);
					var height = Math.abs(
						event.touches[1].pageY - event.touches[0].pageY,
					);
					var dist = Math.sqrt(base ** 2 + height ** 2);
					var deltaDist = this.startDistance - dist;
					var temp = this.camera.fov + deltaDist * 0.2;
					// this.camera.position.x+=1;

					if (temp > 20 && temp < 70) {
						this.camera.fov += deltaDist * 0.2;
						this.camera.updateProjectionMatrix();
					}

					this.startDistance = dist;
				}

				// if (!this.deviceOrientationEventFired) {
				//     this.deviceOrientationHandler(event);
				// }
			});
		}

		window.c = this.controls;
		// this.controls.enableDamping = true;
		// this.controls.dampingFactor = 0.05;
		// this.controls.enableKeys = false;
		// this.controls.enableZoom = true;
		// window.c = this.controls;
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


	setupCharacterControls(model, charMixer, animationsMap, storeMixer) {
		debugger;
        this.controls.minDistance = 2;
        this.controls.maxDistance = 6;
        this.controls.enablePan = false;
        this.controls.maxPolarAngle = Math.PI / 2 - 0.05;
        // this.controls.minPolarAngle = - Math.PI / 2 - 0.05;

		this.characterControls = new CharacterControls(model, charMixer, animationsMap, this.controls, this.camera, 'Idle_anim',null, [], true, true ,false,storeMixer);
		// this.characterControls = new CharacterControls(model, charMixer, animationsMap, this.controls, this.camera, 'Idle',null, [], true, false );
		window.characterControls = this.characterControls ;


        // this.cube = createCube();
        if(this.scene){
        // this.loader = new GLTFLoader();
		// this.loader.crossOrigin = true;
        // this.loader.load("https://cdn.obsess-vr.com/realtime3d/static/glb_files/mixamoriggedopaque.glb", (data) => {
        //     this.loader.load("https://cdn.obsess-vr.com/realtime3d/static/glb_files/animations.glb", (anims) => {
        //         this.animations = anims.animations
        //         const model = data.scene;
		// 		// const model = createCube();

		// 		window.model = model;

        //         const charAnimations = this.animations;
        //         const charMixer = new THREE.AnimationMixer(model);
        //         const animationsMap = new Map();
        //         charAnimations.filter(a => a.name != 'T-Pose').forEach((a) => {
        //             animationsMap.set(a.name, charMixer.clipAction(a));
        //         });
		// 		let initModelPos = [0, 0.1,3 ];
		// 		model.position.set(...initModelPos);
		// 		model.scale.set(1.2, 1.2, 1.2);
		// 		this.characterControls = new CharacterControls(model, charMixer, animationsMap, this.controls, this.camera, 'Idle',null, [], true, true );
		// 		window.characterControls = this.characterControls ;

        //         this.scene.add(model);

        //     });
        // });
        }

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
