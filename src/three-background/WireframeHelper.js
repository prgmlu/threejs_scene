import * as THREE from 'three';

import ThreeSceneObject from '../three-base-components/ThreeSceneObject';

export default class WireframeHelper extends ThreeSceneObject {
    constructor(geometry) {
        super();
        const wireframe = new THREE.WireframeGeometry(geometry);

        const line = new THREE.LineSegments(wireframe);

        line.material.depthTest = false;
        line.material.opacity = 0.5;
        line.material.transparent = true;

        this.sceneObject = line;
    }

    dispose() {
        super.dispose();

        this.sceneObject.material.dispose();
        this.sceneObject.geometry.dispose();
        this.sceneObject = null;
    }
}
