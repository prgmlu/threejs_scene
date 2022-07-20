import * as THREE from 'three';
import { browserName } from 'react-device-detect';
import { VRButton } from 'three/examples/jsm/webxr/VRButton';
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer';

export const initThreeJSScene = (
	canvasRef,
	cameraRef,
	controlsRef,
	rendererRef,
	scene,
	css2DRendererRef,
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
	setupCSS2DRenderer(css2DRendererRef.current, canvas);

	scene.add(cameraRef.current);
};

export const setupRenderer = (renderer, canvasContainer) => {
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(canvasContainer.offsetWidth, canvasContainer.offsetHeight);
	renderer.setClearColor('black');
	// Enable XR and other features per browser name
	switch (browserName) {
		case 'Oculus Browser':
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

export const setupCSS2DRenderer = (css2DRenderer, canvas) => {
	css2DRenderer.domElement.style.position = 'absolute';
	css2DRenderer.domElement.style.top = '0px';
	css2DRenderer.domElement.style.zIndex = 0;
	css2DRenderer.domElement.style.pointerEvents = 'none';
	canvas.appendChild(css2DRenderer.domElement);
};

export const createCSS2DRenderer = () => {
	const ret = window.css2DRenderer || new CSS2DRenderer();
	window.css2DRenderer = ret;
	return ret;
};
