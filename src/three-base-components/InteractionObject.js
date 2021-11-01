import * as THREE from 'three';
import ThreeSceneObject from './ThreeSceneObject';
import ThreeSceneObjectComponent from './ThreeSceneObjectComponent';
import BoxCollider from './BoxCollider';
import { v1 as uuid } from 'uuid';


export default class InteractionObject extends ThreeSceneObject {
    constructor() {
        super();
        this.uuid = uuid();
        this.sceneObject = new BoxCollider(1, 1, 1, this.onHover, this.onUnhover, this.onClick);
        this.sceneObject.setOwner(this);
        this.visualObject = null;
        this.userData = null; //custom data provided by users
    }




    /**
     * Call all the onHover function on the components attached to this InteractableObject.
     * Call when the collider attached to this InteractableObject is hovered.
     */
    onHover = () => {
        this.components.forEach((component) => {
            if (component.onHover) component.onHover();
        });
    }

    /**
     * Call all the onUnhover function on the components attached to this InteractableObject.
     * Call when the collider attached to this InteractableObject is unhovered.
     */
    onUnhover = () => {
        this.components.forEach((component) => {
            if (component.onUnhover) component.onUnhover();
        });
    }


    setUserData=(data)=>{
        this.userData = data;
    }





    /**
     * Call all the onClick function on the components attached to this InteractableObject.
     * Call when the collider attached to this InteractableObject is clicked.
     */
    onClick = (e) => {

        //Display UI
        this.openUI(e);
    }

    openUI=(e)=>{
        //Display UI only if UI component associated with the marker
        if(!this.UIConfig?.Component) return;

        this.scene.setUI({
            Component:this.UIConfig.Component,
            style:this.UIConfig.style,
            props:{
                Modal:{
                    closeModal: ()=>{
                        this.scene.setUI(false);
                    }
                },
                Marker:{
                    uuid:this.uuid,
                    userData:this.userData, //custom user data
                    scale:this.sceneObject.scale, //currently sceneObject & visualObject keep same scale value
                    renderOrder:this.sceneObject.renderOrder,
                    setUserData:this.setUserData,
                    getTransforms:this.getTransforms,
                    transforms:this.getTransforms(),
                    removeFromScene:this.dispose,
                    setScale:this.setScale,
                    setRenderOrder:this.setRenderOrder,
                }
            }});


        //Compute modal positioning
        if(this.UIConfig.positionNextToTheElement){
            const UIel = document.getElementById('canvasUI');
            const UIBoundingBox =UIel.getBoundingClientRect();
            const canvas = document.querySelector('#canvas-wrapper canvas');
            const canvasBoundingBox = canvas.getBoundingClientRect();

            let left = e.offsetX;
            let top = e.offsetY;


            if(left + UIBoundingBox.width > canvasBoundingBox.width){
                left -= UIBoundingBox.width;
            }

            if(top + UIBoundingBox.height > canvasBoundingBox.height){
                top -= UIBoundingBox.height;
            }

            UIel.style.left = `${left}px`;
            UIel.style.top = `${top}px`;
        }
    }



    /**
     * Set the visiualObject attached to this InteractableObject.
     * @param {THREE.Object3D} visualObject - the visual representation of this InteractableObject
     */
    // TODO: To make this more generic, we can refactor the visual object into a component as well.
    setVisualObject = (visualObject) => {
        if (!visualObject) {
            this.visualObject = null;
            return;
        }
        if (!(visualObject instanceof THREE.Object3D)) {
            console.error('Can\'t set visual object to a non THREE.Object3D type!'); // eslint-disable-line no-console
            return;
        }
        this.visualObject = visualObject;
        this.visualObject.name = 'visualObject';
    }

    // setPosition = (positionVector) => {
    //     this.visualObject.position = positionVector;
    //     this.BoxCollider.position = positionVector;
    // }
    setPosition(x, y, z){
        this.sceneObject.position.set(x, y, z);

        if (this.isFlatBackground) this.sceneObject.position.x = -10;
        else this.sceneObject.position.clampLength(10, 10);

        this.visualObject.position.copy(this.sceneObject.position);
    }


    /**
     * Set the transform of the visualObject attached to this InteractableObject.
     * @param {Array} transformArray - 4x4 matrix transform of the visualObject
     */
    // setTransform = (transformArray) => {
    //     if (!this.visualObject) {
    //         console.error('Can\'t set transform on an interactable object without a visual object!'); // eslint-disable-line no-console
    //         return;
    //     }
    //
    //     const { visualObject } = this;
    //     const matrix4x4 = new THREE.Matrix4();
    //     matrix4x4.fromArray(transformArray);
    //     visualObject.matrix = matrix4x4;
    //     visualObject.matrix.decompose(
    //         visualObject.position,
    //         visualObject.quaternion,
    //         visualObject.scale,
    //     );
    // }

    setTransform (colliderTransform, visualTransform) {
        const colliderMatrix = new THREE.Matrix4();
        colliderMatrix.fromArray(colliderTransform);

        const visualMatrix = new THREE.Matrix4();
        visualMatrix.fromArray(visualTransform);

        this.sceneObject.setTransform(colliderMatrix);

        this.visualObject.matrix = visualMatrix;
        this.visualObject.matrix.decompose(
            this.visualObject.position, this.visualObject.quaternion, this.visualObject.scale,
        );
    }

    getTransforms = () => {
        if(!this.sceneObject) {
            console.error('sceneObject not assigned', this.sceneObject );
            return false;
        }

        const colliderTransform = this.sceneObject.matrix;
        const visualTransform = this.visualObject.matrix;

        return { colliderTransform, visualTransform };
    }

    /**
     * Set the transform of the collider attached to this InteractableObject.
     * @param {Array} transformArray - 4x4 matrix transform of the collider
     */
    setColliderTransform = (colliderTransformArray) => {
        const matrix4x4 = new THREE.Matrix4();
        matrix4x4.fromArray(colliderTransformArray);
        this.sceneObject.setTransform(matrix4x4);
    }

    /**
     * Attach this ThreeSceneObjectComponent to this InteractableObject
     * @param {ThreeSceneObjectComponent} component - an ThreeSceneObjectComponent
     */
    attachComponent = (component) => {
        if (!(component instanceof ThreeSceneObjectComponent)) {
            console.error('Can\'t attach object of non ThreeSceneObjectComponent type to an InteractableObject!'); // eslint-disable-line no-console
            return;
        }

        component.setOwner(this);
        this.components.push(component);
    }




}
