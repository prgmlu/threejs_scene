import * as THREE from 'three';
import { isMobile } from 'react-device-detect';
import ThreeSceneObject from '../../three-base-components/ThreeSceneObject';
import ThreeController from '../../three-controls/ThreeController';

export default class ThreeFlatBackground extends ThreeSceneObject {
	constructor(enablePan, type) {
		super();
		this.type = type;
		this.geometry = null;
		this.loader = this.setupTextureLoader();
		this.controls = ThreeController.setupPanControls(enablePan);
		this.setInitialObject();
		this.setPanArea = this.setPanArea.bind(this);
	}

	setInitialObject = () => {
		const material = new THREE.MeshBasicMaterial({
			depthTest: false,
			depthWrite: false,
			// wireframe:true
		});

		const width = this.type === 'zoom' && isMobile ? 15.15 : 14.15; // Temp fix, we need to adjust this for different canvas sizes
		this.geometry = new THREE.PlaneGeometry(width, 14.15);
		this.sceneObject = new THREE.Mesh(this.geometry, material);
		this.sceneObject.rotateY(THREE.Math.degToRad(90));
		this.sceneObject.position.x = -10;
		this.sceneObject.name = 'flatBackground';
	};

	setupTextureLoader = () => {
		// const loadingManager = new THREE.LoadingManager();
		return new THREE.TextureLoader();
	};

	setPanArea() {
		// const canvasWidth = this.controls.domElement.offsetWidth;
		// const offset = (10.6 * canvasWidth) / 900;
		// const ratio = (14.15 * this.width) / 2 - offset;
		// const minMax = this.width > 1 ? ratio : 0;
		// this.controls.minPan = new THREE.Vector3(0, 0, 0);
		// this.controls.maxPan = new THREE.Vector3(0, 0, 0);
	}

	loadTexture = (url, onBackgroundReady = () => {}) => {
		this.loader.load(url, (texture) => {
			onBackgroundReady(true);
			texture.minFilter = THREE.LinearFilter;
			texture.magFilter = THREE.LinearFilter;
			texture.wrapS = THREE.ClampToEdgeWrapping;
			texture.wrapT = THREE.ClampToEdgeWrapping;
			this.setMaterial(texture);
		});
	};

	resetMaterial = () => {
		if (this.sceneObject) {
			this.sceneObject.material.map = null;
			this.sceneObject.material.needsUpdate = true;
		}
	};

	setMaterial(texture) {
		const { image } = texture;
		this.width = image.width / image.height;

		if (this.sceneObject) {
			if (this.type !== 'zoom' || (this.type === 'zoom' && !isMobile))
				this.sceneObject.scale.set(this.width, 1, 1);
			this.sceneObject.material.map = texture;
			this.sceneObject.material.needsUpdate = true;
		}
		this.setPanArea();
	}

	dispose() {
		super.dispose();

		this.sceneObject.material?.dispose();
		this.sceneObject.material?.map?.dispose();
		this.sceneObject.geometry.dispose();
		this.sceneObject = null;
	}
}
