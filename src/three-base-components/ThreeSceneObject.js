import ThreeSceneObjectComponent from './ThreeSceneObjectComponent';
import * as THREE from 'three';

export default class ThreeSceneObject {
    constructor() {
        this.addToScene = this.addToScene.bind(this);
        this.removeFromScene = this.removeFromScene.bind(this);
        this.dispose = this.dispose.bind(this);

        this.scene = null;
        this.components = [];
        this.sceneObject = null;

        // Enable Three Cache
        THREE.Cache.enabled = true

    }

    addToScene(scene) {
        this.scene = scene;
        this.scene.add(this.sceneObject);
    }

    removeFromScene() {
        this.scene.remove(this.sceneObject);
    }

    /**
     * Get all the ThreeSceneObjectComponent of type that is attached to this InteractableObject
     * @param {ThreeSceneObjectComponent} type - the type of the component to search for
     * @returns {Array} - an array of ThreeSceneObjectComponent of type
     */
    getComponentsOfType(type) {
        if (!(type.prototype instanceof ThreeSceneObjectComponent)) {
            console.error(`Can't get type ${type.name}of non ThreeSceneObjectComponent!`); // eslint-disable-line no-console
            return null;
        }
        return this.components.filter((component) => component instanceof type);
    }

    disposeMaterials = () => {
        const sceneObjInArray = this.sceneObject.type === 'Group'? this.sceneObject.children : [this.sceneObject];
        sceneObjInArray.forEach((obj)=>{
            if (obj.material?.length) {
                obj.material.forEach((mesh) => {
                    mesh?.map?.dispose();
                    // mesh.map=null;
                    mesh.dispose();
                });
                // obj.material=null;
            } else if (obj.material) {
                obj.material.dispose();
            }
        })
    }


    dispose() {
        this.disposeMaterials();
        if (this.scene) {
            this.components.forEach((component) => {
                if (component.dispose) component.dispose();
            });
            this.components = [];
            this.removeFromScene();
        }
    }


}
