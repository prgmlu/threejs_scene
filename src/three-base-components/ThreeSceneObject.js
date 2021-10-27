import ThreeSceneObjectComponent from './ThreeSceneObjectComponent';

export default class ThreeSceneObject {
    constructor() {
        this.addToScene = this.addToScene.bind(this);
        this.removeFromScene = this.removeFromScene.bind(this);
        this.dispose = this.dispose.bind(this);

        this.scene = null;
        this.components = [];
        this.sceneObject = null;
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
        const results = this.components.filter((component) => component instanceof type);
        return results;
    }

    dispose() {
        if (this.scene) {
            this.components.forEach((component) => {
                if (component.dispose) {
                    component.dispose();
                }
            });
            this.components = [];
            this.removeFromScene();
        }
    }
}
