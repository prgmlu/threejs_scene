import * as THREE from 'three';
import { v1 as uuid } from 'uuid';
import ThreeSceneObject from '../../three-base-components/ThreeSceneObject';
import ThreeSceneObjectComponent from '../../three-base-components/ThreeSceneObjectComponent';
import BoxCollider from '../../three-base-components/BoxCollider';
import Tooltip from '../../Components/Tooltip';



export default class InteractionObject extends ThreeSceneObject {
    //Declare private fields
    #camera;

    constructor({ transform, collider_transform, boxColliderConfig, visualObjectConf={}, UIConfig,userData,tooltip, camera, ...params }) {
        super();
        this.uuid = uuid();
        this.#camera = camera;
        this.cameraPosition = new THREE.Vector3(0, 0, 0);

        this.config={
            enable_moving_visual_only:visualObjectConf.enable_moving_visual_only,
            tooltip,boxColliderConfig,visualObjectConf,userData
        }

        this.group = new THREE.Group();
        this.markerType = null;
        this.sceneObject = new BoxCollider(this.onHover, this.onUnhover, this.onClick, boxColliderConfig);
        this.sceneObject.name = 'marker';
        this.sceneObject.setOwner(this);
        this.visualObject = null;
        this.userData = userData; //custom data provided by users
        this.UIConfig = UIConfig;
        this.transform = transform;
        this.collider_transform = collider_transform;

        this.visualPositionOffset; //store offset vector if enabled visual object only position move


        //TODO: by default, use getSceneCenterPos() to set position as any scene object cannot be set in nowhere.
    }



    setTooltipConfig=(config)=>{

        if(this.tooltip) this.tooltip.updateConfig(config);

        //if was not yet initialized, do it now.
        else{
            this.tooltip = new Tooltip(config);
            this.tooltip.tooltipSceneObject.position.copy(this.visualObject.position);
            this.scene.add(this.tooltip.tooltipSceneObject);
            this.tooltip.mount();
        }
    }


    _postAddToScene=()=>{
        //Tooltips. enable & render only if props provided. Avoid unnecessary mounting of tooltips
        if(this?.config?.tooltip) {
            this.tooltip = new Tooltip(this.config.tooltip);
            this.tooltip.tooltipSceneObject.position.copy( this.visualObject.position);
            this.scene.add(this.tooltip.tooltipSceneObject);
            this.tooltip.mount();
            // this.attachComponent(this.tooltip.tooltipSceneObject);
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
            console.error(`Can't set visual object to a non THREE.Object3D type!`, visualObject); // eslint-disable-line no-console
            return;
        }
        this.visualObject = visualObject;
        this.visualObject.name = 'visualObject';
        this.visualObject.owner_uuid = this.uuid;
    }


    //Scale configs for visual & collider objects
    setScaleXYZ = (x,y,z) => {
        if(x){
            this.sceneObject.scale.x = x;
            this.visualObject.scale.x = x;
        }
        if(y){
            this.sceneObject.scale.y = y;
            this.visualObject.scale.y = y;
        }
        if(z){
            this.sceneObject.scale.z = z;
            this.visualObject.scale.z = z;
        }
    }

    setVisualScale = (scale) => {
        if(!scale || !this.visualObject) return;
        this.visualObject.scale.set(scale, scale, scale);
    }

    setVisualScaleXYZ = (x,y,z) => {
        if(!this.visualObject || !x || !y || !z) return;
        this.visualObject.scale.set(x, y, z);
    }

    setColliderScale = (x, y, z) => {
        if(this.sceneObject){
            if(x) this.sceneObject.scale.x = x;
            if(y) this.sceneObject.scale.y = y;
            if(z) this.sceneObject.scale.z = z;
        }else{
            console.error('setColliderScale: no sceneObject');
        }
    }

    setColliderVerticalScale = (scale = 1) => {
        this.sceneObject.scale.y = scale;
    }

    setColliderHorizontalScale = (scale = 1) => {
        this.sceneObject.scale.x = scale;
    }

    setColliderDepthScale = (scale = 1) => {
        this.sceneObject.scale.z = scale;
    }

    rotateObjectToCamera=()=>{
        if(this.sceneObject && this.visualObject){
            this.sceneObject.setRotationFromMatrix(this.#camera.matrixWorld);
            this.visualObject.setRotationFromMatrix(this.#camera.matrixWorld);
        }
    }

    setRotationXYZ = (x,y,z) => {
        if(x){
            this.sceneObject.rotation.x = x;
            this.visualObject.rotation.x = x;
        }
        if(y){
            this.sceneObject.rotation.y = y;
            this.visualObject.rotation.y = y;
        }
        if(z){
            this.sceneObject.rotation.z = z;
            this.visualObject.rotation.z = z;
        }
    }

    setColliderConfig =({color, opacity})=>{
        if(this?.sceneObject?.material){
            if(color) this.sceneObject.material.color = new THREE.Color(color);
            if(opacity>=0) this.sceneObject.material.opacity = opacity;
        }
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
        this.openUI(e);//Display UI

        //cancel moving visual only mode if sceneLib has another marker active in that mode
        if(window.sceneLib.moving_visual_only_marker?.uuid && window.sceneLib.moving_visual_only_marker.uuid !==this.uuid){
            window.sceneLib.moving_visual_only_marker.disableMovingVisualOnly();
        }
    }

    onDblclick=(target)=>{
        //activate moving visual only if Dblclick on visual object
        if(target ==='visualObject' && this.config?.enable_moving_visual_only) {
            this.toggleVisualMovingStatus();
        }
    }








    closeUI=()=>{
        this.uiStatus = false;
        this.scene.setUI(false);
    }

    openUI=(e)=>{
        //Display UI only if UI component associated with the marker
        if(!this.UIConfig?.Component) return;
        this.uiStatus = true;

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
                    name:this.sceneObject?.name,
                    uuid:this.uuid,
                    config:this.config,//hotspot component user parameters



                    //Collider parameters: color, opacity
                    setColliderConfig:this.setColliderConfig,

                    //Transforms
                    transforms:this.getTransforms(),
                    getTransforms:this.getTransforms,

                    //Scale Values
                    scales:{
                        collider : this.sceneObject?.scale,
                        sceneObject : this.visualObject?.scale,//TODO:rename to visualObject
                    },
                    scale:this.visualObject?.scale,


                    //Set  Scales
                    setScaleXYZ:this.setScaleXYZ,//scale visual and collider at same time
                    setVisualScale:this.setVisualScale,
                    setVisualScaleXYZ:this.setVisualScaleXYZ,
                    setColliderScale:this.setColliderScale,
                    setColliderVerticalScale:this.setColliderVerticalScale,
                    setColliderHorizontalScale:this.setColliderHorizontalScale,
                    setColliderDepthScale:this.setColliderDepthScale,

                    //Rotation
                    rotation:{
                        collider:this.sceneObject?.rotation,
                        visualObject:this.visualObject?.rotation,
                    },
                    setRotationXYZ:this.setRotationXYZ,
                    setSVGRotation:this.visualObject?.setSVGRotation,
                    getSVGRotation:this.visualObject?.getSVGRotation,

                    //Sort of z-index for scene elements
                    setRenderOrder:this.setRenderOrder,
                    renderOrder:this.sceneObject?.renderOrder,

                    //Custom User Data
                    userData:this.userData, //custom user data
                    setUserData:this.setUserData,

                    // label functions
                    setArrowConfig: this.setArrowConfig,
                    setLabelStyling: this.setLabelStyling,
                    setContainerStyling: this.setContainerStyling,

                    //Tooltip
                    setTooltipConfig:this.setTooltipConfig,

                    // Object Animation
                    startAnimation:this.startAnimation,
                    stopAnimation:this.stopAnimation,
                    moveTowardsCamera:this.moveTowardsCamera,
                    getDistanceFromCamera:this.getDistanceFromCamera,

                    //UI
                    closeUI:this.closeUI
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





    getDistanceFromCamera = () => {
        let distanceFromCamera = this.cameraPosition.distanceTo(this.sceneObject.position);
        return distanceFromCamera;
    }

    moveTowardsCamera = (distance) =>{
        let direction = this.sceneObject.position.normalize();
        let newPos = direction.multiplyScalar(distance);
        console.log('moveTowardsCamera', { newPos, direction, objectPos:this.sceneObject.position, 'this':this });
        this.setPosition(newPos.x, newPos.y, newPos.z, true);
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
        const colliderMatrix = new THREE.Matrix4().fromArray(colliderTransform);
        this.sceneObject.setTransform(colliderMatrix);


        const visualMatrix = new THREE.Matrix4().fromArray(visualTransform);
        this.visualObject.matrix = visualMatrix;


        this.visualObject.matrix.decompose(this.visualObject.position, this.visualObject.quaternion, this.visualObject.scale,);

        //compute offset
        if(JSON.stringify(this.sceneObject.position) !== JSON.stringify(this.visualObject.position)){
            this.visualPositionOffset = new THREE.Vector3().copy(this.sceneObject.position).sub(this.visualObject.position);
        }

    }

    //should be able to cover visualObject updates of all types
    updateVisualObjectConf=(newConf)=>{
        // console.log('Visual CONFIG CHANGED', {newConf, oldConf:this.visualObject.config, 'this':this});
        //General:
        if(newConf.hasOwnProperty('enable_moving_visual_only')) this.config.enable_moving_visual_only = newConf.enable_moving_visual_only;

        //Updates by marker type can vary
        if(this?.visualObject?.type=== "Sprite") this.visualObject.updateSVGConfig(newConf);
    }


    getTransforms = () => {
        if(!this.sceneObject) {
            console.error('getTransforms Error: sceneObject not assigned', {sceneObject:this.sceneObject, 'this':this} );
            return false;
        }

        const colliderTransform = this.sceneObject?.matrix;
        const visualTransform = this.visualObject?.matrix;

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
        if (!(component instanceof ThreeSceneObjectComponent) && !(component instanceof THREE.Sprite)) {
            console.error(`Can't attach object of non ThreeSceneObjectComponent type to an InteractableObject! or THREE.Sprite`); // eslint-disable-line no-console
            return;
        }

        if(component?.setOwner) component.setOwner(this);
        this.components.push(component);
    }

    //Get center of the scene coord (rename to getCameraCenterPos, move to utils)
    getSceneCenterPos=()=>{
        const position = new THREE.Vector3(0, 0, -10);
        position.applyQuaternion(this.#camera.quaternion);
        return position;
    }

    lookAtCamera = (position = this.#camera.position) => {
        if (this.scene.isFlatBackground) {
            position = new THREE.Vector3(this.#camera.position.x, this.sceneObject.position.y, this.sceneObject.position.z);
        }
        this.visualObject.lookAt(position);
        this.sceneObject.lookAt(position);
    }




    /*************************************************************************/
    /*                       Moving VisualOnly                               */
    /*************************************************************************/


    toggleVisualMovingStatus=()=>{
        const newStatus = !this.config.moving_visual_only_activated;
        this.config.moving_visual_only_activated = newStatus;

        //Enable
        if(newStatus == true){
            console.log('--ENABLE MovingVisual', {uuid:this.uuid, 'this':this });
            //if other object has enabled moving, disable it
            const otherMarkerEnabled = window.sceneLib?.moving_visual_only_marker?.uuid && (window.sceneLib.moving_visual_only_marker.uuid !==this.uuid);
            //cancel moving visual only on other marker if enabled
            if(otherMarkerEnabled) window.sceneLib.moving_visual_only_marker.disableMovingVisualOnly();


            this.visualObject.setComponentToMovingVisualOnlyModeEnabled();
            window.sceneLib.moving_visual_only_marker = this;
        }
        //Disable
        else{
            this.disableMovingVisualOnly();
            console.log('--DISABLE MovingVisual', {uuid:this.uuid, 'this':this });
        }
        console.log('onDblclick', { newStatus, marker:this });
    }

    disableMovingVisualOnly=()=>{
        if( !this?.visualObject || !this.config?.enable_moving_visual_only) return;
        // console.log(`--disableMovingVisualOnly`, {uuid:this.uuid, "this":this });
        this.config.moving_visual_only_activated = false;
        window.sceneLib.moving_visual_only_marker = null;
        this.visualObject.setComponentToMovingVisualOnlyModeDisabled();
    }



    setPosition(x, y, z, noClamp = false){
        if(!this?.sceneObject){
            console.error('sceneObject is not defined')
            return;
        }
        this.sceneObject.position.set(x, y, z);

        //should not go behind the sphere
        if (this.isFlatBackground) this.sceneObject.position.x = -10;
        else if(noClamp) {}
        else this.sceneObject.position.clampLength(10, 10);

        this.visualObject?.position.copy(this.sceneObject.position);

        // Tooltips (if enabled)
        if(this.tooltip?.tooltipSceneObject) this.tooltip.tooltipSceneObject.position.copy(this.visualObject.position);
    }

    //Note: maybe relocate move with offset into regular setPosition?
    setPositionWithVisualOffsetEnabled(x, y, z, raycaster){
        if(!this?.config?.enable_moving_visual_only) {
            throw Error('This Method cant be used as enable_moving_visual_only is not activated')
            return;
        }

        // console.log('setPositionWithVisualOffsetEnabled', {conf:this?.config});
        if(this?.config?.moving_visual_only_activated) {
            const [intersectedCollider] = raycaster.intersectObjects([this.sceneObject]);

            //move while intersects collider
            if(intersectedCollider) {
                // console.log('--intersects, move', { cord:{x, y, z}, intersectedCollider, visual:this.visualObject });

                this.setVisualOnlyObjectPosition(intersectedCollider.point.x, intersectedCollider.point.y, intersectedCollider.point.z);
            }
        }
        //move with offset
        else{
            this.sceneObject.position.set(x, y, z);

            //should not go behind the sphere
            if (this.isFlatBackground) this.sceneObject.position.x = -10;
            else this.sceneObject.position.clampLength(10, 10);


            //with offset
            if(this.visualPositionOffset ){
                const posWithOffset = new THREE.Vector3().copy(this.sceneObject.position).sub(this.visualPositionOffset);
                this.setVisualOnlyObjectPosition(posWithOffset.x, posWithOffset.y, posWithOffset.z );
            }
            //equal positioning
            else{
                this.visualObject?.position.copy(this.sceneObject.position);
            }
        }

        //if tooltips enabled.
        if(this.tooltip?.tooltipSceneObject) this.tooltip.tooltipSceneObject.position.copy(this.visualObject.position);
    }

    setVisualOnlyObjectPosition=(x, y, z)=>{
        this.visualObject.position.set(x, y, z);
        if (this.isFlatBackground) this.visualObject.position.x = -10;
        else this.visualObject.position.clampLength(10, 10);

        //re-set offset
        if(!this.visualPositionOffset) this.visualPositionOffset = new THREE.Vector3();
        this.visualPositionOffset.copy(this.sceneObject.position).sub({x,y,z});
    }
    /***************************************************************************/
    /*                    END  Moving VisualOnly                               */
    /***************************************************************************/




    dispose() {
        // console.log('%c mainDISPOSE', 'color:red', this);

        this.components?.map((item) => item.dispose());

        this.scene.remove(this.visualObject);
        this.scene.remove(this.sceneObject);
        if(this.tooltip?.tooltipSceneObject) this.scene.remove(this.tooltip.tooltipSceneObject);

        super.dispose();

        this.setVisualObject(null);
        this.sceneObject = null;
    }

}
