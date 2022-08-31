import * as THREE from 'three';
import OrbitControls from './OrbitControls';
import DeviceOrientationControls from './DeviceOrientationControls';
import { XRControllerModelFactory } from 'three/examples/jsm/webxr/XRControllerModelFactory';
import { isAndroid } from 'react-device-detect';

class ThreeController {
	setupControls(camera, renderer, orbitControlsConfig) {
		this.startDistance = null;
		this.camera = camera;
		this.controls = isAndroid
			? new DeviceOrientationControls(this.camera, renderer.domElement)
			: new OrbitControls(
					this.camera,
					renderer.domElement,
					orbitControlsConfig,
			  );

		if (isAndroid) {
			this.controls.connect();
		}

		// if (window.count > 1) {
		renderer.domElement.addEventListener('touchend', (event) => {
			this.startDistance = null;
		});

		renderer.domElement.addEventListener('touchmove', (event) => {
			if (event.touches.length !== 1) {
				event.preventDefault();
			}

			if (event.touches.length === 2) {
				const base = Math.abs(
					event.touches[1].pageX - event.touches[0].pageX,
				);
				const height = Math.abs(
					event.touches[1].pageY - event.touches[0].pageY,
				);
				const dist = Math.sqrt(base ** 2 + height ** 2);
				const deltaDist = this.startDistance - dist;
				const temp = this.camera.fov + deltaDist * 0.2;
				// this.camera.position.x+=1;

				if (temp > 20 && temp < 70) {
					this.camera.fov += deltaDist * 0.2;
					this.camera.updateProjectionMatrix();
				}

				this.startDistance = dist;
			}
		});
		// }

		window.c = this.controls;
		// this.controls.enableDamping = true;
		// this.controls.dampingFactor = 0.05;
		// this.controls.enableKeys = false;
		// this.controls.enableZoom = true;
		// window.c = this.controls;
		this.controls.enableZoom = true;
		this.controls.maxDistance = 0.1;
		this.controls.minDistance = 0;

		return this.controls;
	}

	setupPanControls = (enablePan = false, enableRotate = true) => {
		this.controls.enablePan = enablePan;
		this.controls.enableRotate = enableRotate;

		if (enablePan) {
			this.controls.panSpeed = 75.0;
			this.controls.screenSpacePanning = true;
			if (this?.controls?.touches) {
				this.controls.touches.ONE = THREE.TOUCH.PAN;
			}
		} else {
			if (this.controls?.touches) {
				this.controls.touches.ONE = THREE.TOUCH.ROTATE;
			}
		}

		// return this.controls;
	};

	setupVRControls(renderer, scene, showOnlyHands) {
		const controllerModelFactory = new XRControllerModelFactory();

		const geometry = new THREE.BufferGeometry().setFromPoints([
			new THREE.Vector3(0, 0, 0),
			new THREE.Vector3(0, 0, -1),
		]);

		// This is a temporary helper line to let the user aim at the objects in scene
		const line = new THREE.Line(geometry);
		line.name = 'line';
		line.scale.z = 0;

		const vrControllers = []; // We return an arra for the 2 controllers
		const gripControls = [];
		const vrHands = [];
		const handsModels = [];

		for (let i = 0; i <= 1; i++) {
			// Used for pointing in Z axis. Returns a THREEJS group
			const controller = renderer.xr.getController(i);

			controller.add(line.clone());
			controller.userData.selectPressed = false;
			scene.add(controller);

			vrControllers.push(controller);

			if (!showOnlyHands) {
				// Used to manipulate objects in the 3D space with the controller. Returns a THREEJS group, these are the visual controllers
				const grip = renderer.xr.getControllerGrip(i);
				grip.add(controllerModelFactory.createControllerModel(grip));
				scene.add(grip);

				gripControls.push(grip);
			}

			// Hands
			const hand = renderer.xr.getHand(i);
			const model = new OculusHandModel(hand);
			hand.add(model);
			handsModels.push(model);
			scene.add(hand);

			vrHands.push(hand);
		}

		this.raycaster = new THREE.Raycaster();

		return { vrControllers, gripControls, vrHands, handsModels };
	}
}

export default new ThreeController();
