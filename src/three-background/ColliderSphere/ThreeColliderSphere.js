import * as THREE from 'three';
import ThreeSceneObject from '../../three-base-components/ThreeSceneObject';

export default class ThreeColliderSphere extends ThreeSceneObject {
    constructor() {
        super();

        const geometry = new THREE.SphereGeometry(-20, 20, 20);
        const material = new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            transparent: true,
            opacity: 0,
        });
        this.sceneObject = new THREE.Mesh(
            geometry,
            material,
        );
        this.sceneObject.name='colliderSphere';
    }
}
