import * as THREE from 'three';
import ThreeController from '../three-controls/ThreeController';
import { browserName } from 'react-device-detect';
import { VRButton } from 'three/examples/jsm/webxr/VRButton';

export const initThreeJSScene = (
	canvasRef,
	cameraRef,
	controlsRef,
	rendererRef,
	scene,
) => {
	// console.log('%c >initThreeJSScene ', 'color:green', JSON.parse(JSON.stringify({
	// canvasRef:canvasRef.current,
	// })));

	const canvas = canvasRef.current;
	const clock = new THREE.Clock();
	clock.start();

	const aspectRatio = canvas.offsetWidth / canvas.offsetHeight;
	// cameraRef.current = new THREE.PerspectiveCamera(70, aspectRatio, 0.1, 1000);
	// controlsRef.current = ThreeController.setupControls(
	// 	cameraRef.current,
	// 	rendererRef.current,
	// );
	// setupCamera(aspectRatio, cameraRef.current);

	setupRenderer(rendererRef.current, canvas);

	scene.add(cameraRef.current);
};

export const setupRenderer = (renderer, canvasContainer) => {
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(canvasContainer.offsetWidth, canvasContainer.offsetHeight);
	renderer.setClearColor('black');

	// Enable XR and other features per browser name
	switch(browserName){
		case "Oculus Browser":
			document.body.appendChild(VRButton.createButton(renderer));
			renderer.xr.enabled = true;
			break;
		default:
			renderer.xr.enabled = false;
	}
	canvasContainer.appendChild(renderer.domElement);
};

export const setupCamera = (camera) => {
	const posX = 0.1;
	const rotY = (90 * Math.PI) / 180;

	camera.position.set(posX, 0, 0);
	camera.rotation.set(0, rotY, 0);
	camera.lookAt(0, 0, 0);
	camera.updateProjectionMatrix();
};
