// * Important: ES6 don't support interface, so we use an inheritance implementation.
// * If interface is introduced in future versions of js, we should refactor this into an interface.

/**
 * Base ThreeSceneObjectComponent class
 */
export default class ThreeSceneObjectComponent {
    constructor() {
        this.setOwner = this.setOwner.bind(this);
        this.removeOwner = this.removeOwner.bind(this);
        this.onDestroy = this.onDestroy.bind(this);

        this.owner = null;
    }

    /** Called when the owner interactable object is added to scene. */
    start = () => {}; // eslint-disable-line

    /** Called when the owner component before component is destroyed
     * (removed from scene, owner destroyed)
     * */
    onDestroy() {} // eslint-disable-line

    /** Called when the owner InteractableObject is hovered */
    onHover = () => {}; // eslint-disable-line

    /** Called when the owner InteractableObject is unhovered */
    onUnhover = () => {}; // eslint-disable-line

    /** Called when the owner InteractableObject is clicked */
    onClick = () => {}; // eslint-disable-line

    /**
     * Set the owner InteractableObject of this ThreeSceneObjectComponent
     * @param {InteractableObject} owner - an InteractableObject
     */
    setOwner(owner) {
        this.owner = owner;
    }

    /** Set this ThreeSceneObjectComponent to have no owner */
    removeOwner() {
        this.owner = null;
    }
}
