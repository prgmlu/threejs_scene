import * as THREE from 'three';

import ThreeSceneObject from '../../three-base-components/ThreeSceneObject';
import ThreeController from '../../three-controls/ThreeController';

export default class ThreeFlatBackground extends ThreeSceneObject {
    constructor() {
        super();
        this.loader = this.setupTextureLoader();
        this.controls = ThreeController.setupPanControls();
        this.setInitialObject();
        this.setPanArea = this.setPanArea.bind(this);
    }

    setInitialObject = () => {
        const material = new THREE.MeshBasicMaterial({
            depthTest: false, depthWrite: false,
        });
        const geometry = new THREE.PlaneGeometry(14.15, 14.15);
        this.sceneObject = new THREE.Mesh(geometry, material);
        this.sceneObject.rotateY(THREE.Math.degToRad(90));
        this.sceneObject.position.x = -10;
        this.sceneObject.name = 'flatBackground';
    }

    setupTextureLoader = () => {
        const loadingManager = new THREE.LoadingManager();
        const loader = new THREE.TextureLoader(loadingManager);

        return loader;
    }

    setMaterial(texture) {
        const { image } = texture;

        this.width = image.width / image.height;
        if(this.sceneObject){
            this.sceneObject.scale.set(this.width, 1, 1);
            this.sceneObject.material.map = texture;
            this.sceneObject.material.needsUpdate = true;
        }

        this.setPanArea();
    }

    setPanArea() {
        const canvasWidth = this.controls.domElement.offsetWidth;
        const offset = (10.6 * canvasWidth) / 900;
        const ratio = (14.15 * this.width) / 2 - offset;
        const minMax = this.width > 1 ? ratio : 0;

        this.controls.minPan = new THREE.Vector3(0, 0, -minMax);
        this.controls.maxPan = new THREE.Vector3(0, 0, minMax);
    }

    loadTexture = (url) => {
        this.loader.load(url, (loadedTexture) => {
            const texture = loadedTexture;
            texture.minFilter = THREE.LinearFilter;
            texture.magFilter = THREE.LinearFilter;
            texture.wrapS = THREE.ClampToEdgeWrapping;
            texture.wrapT = THREE.ClampToEdgeWrapping;
            this.setMaterial(texture);
        });
    }

    dispose() {
        super.dispose();

        this.sceneObject.material.dispose();
        this.sceneObject.geometry.dispose();
        this.sceneObject = null;
    }
}
