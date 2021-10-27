import * as THREE from 'three';
import OrbitControls from './OrbitControls';

class ThreeController {
    setupControls(camera, renderer) {
        this.controls = new OrbitControls(camera, renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.enableKeys = false;
        this.controls.enableZoom = false;

        return this.controls;
    }

    setupPanControls() {
        this.controls.enablePan = true;
        this.controls.enableRotate = false;
        this.controls.panSpeed = 100;
        this.controls.mouseButtons.LEFT = THREE.MOUSE.PAN;
        this.controls.mouseButtons.RIGHT = THREE.MOUSE.DOLLY;
        this.controls.screenSpacePanning = true;

        return this.controls;
    }

    setupRotateControls() {
        this.controls.enableRotate = true;
        this.controls.enablePan = false;
        this.controls.rotateSpeed = 0.3;
        this.controls.maxPolarAngle = Math.PI;

        return this.controls;
    }
}

export default new ThreeController();
