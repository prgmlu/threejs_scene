import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from '../../node_modules/three/examples/jsm/loaders/DRACOLoader.js';
import { initCSSRenderer, addToolTipToModel } from './toolTipHelpers';
import { hideAllExceptFirstClothItem } from '../three-background/threeHelpers';


const FADE_DURATION = .4;

let charTypeMap = {
    "Female_Type_A":{
        // url:"https://cdn.obsess-vr.com/realtime3d/static/glb_files/defaultChar_female_v002.glb",
        // url:"https://cdn.obsess-vr.com/realtime3d/defaultChar_female_v004.glb",
        url:"https://cdn.obsess-vr.com/realtime3d/defaultChar_female_v005.glb",

        scale: 1,
    }
}

export default class RemoteChar{
    //will have a Position and Rotation, animations and a mixer.
    // the central control will be always be interpolating between the last position and last rotation and the new position and rotation.
    constructor(charType , position, rotation, address, charName, ADD_TOOLTIP, applyAdjustements=null){

        this.animations = null;
        this.mixer = null;
        this.model = null;
        this.position = position;
        this.rotation = rotation;
        this.currentAction = null;

        this.charName = charName;
        this.ADD_TOOLTIP = ADD_TOOLTIP;

        this.tooltipDiv = null;

        this.applyAdjustements = applyAdjustements;
        this.address = address;


        this.setupLoader();
        this.charType = charType;
        this.url = charTypeMap[charType].url;
        this.loadModel(this.url);


    }

    interpolateToPosition(position){
        this.model.position.lerp(position, 0.1);
        if(this.model.position.distanceTo(position) > 0.1){
            requestAnimationFrame(this.interpolateToPosition.bind(this, position));
        }
    }

    setPosition(position){
        //an object not a vector
        this.model.position.set(position.x, position.y, position.z);
        this.position = position;
    }

    getPosition(){
        return this.position;
    }

    setRotation(rotation){
        //an object not a vector
        this.model.rotation.set(rotation._x, rotation._y, rotation._z);
        this.rotation = rotation;
    }

    getRotation(){
        return this.rotation;
    }


    setModelScale(){
        let s = charTypeMap[this.charType].scale;
        this.model.scale.set(s, s, s);

    }
    
    loadModel = (url)=> {
        this.loader.load(url, (gltf) => {
            this.animations = gltf.animations;
            this.model = gltf.scene;
            this.setPosition(this.position)
            this.setRotation(this.rotation)

            if(this.ADD_TOOLTIP){
                let {div,tooltipMesh } = addToolTipToModel(this.model, this.charName);
                this.tooltipDiv = div;
                this.tooltipMesh = tooltipMesh;
            }

            this.setModelScale();
            // if(this.applyAdjustements){
                //like the envMap
                alert('hding')
                hideAllExceptFirstClothItem(this.model);
            // }

            this.setupMixer();
            this.setupAnimations();   
            this.addToScene(window.scene);

        });
    }

    playWalkingAnimation(){
        if(this.currentAction === this.walkingAction) return;

        this.idleAction.fadeOut(FADE_DURATION);
        this.walkingAction.reset().fadeIn(FADE_DURATION).play();

        this.currentAction = this.walkingAction;
    }

    playIdleAnimation(){
        if(this.currentAction === this.idleAction) return;

        this.walkingAction.fadeOut(FADE_DURATION);
        this.idleAction.reset().fadeIn(FADE_DURATION).play();

        this.currentAction = this.idleAction;
    }

    setupAnimations(){
        this.idleAction = this.mixer.clipAction( this.animations[0] );
        this.walkingAction = this.mixer.clipAction( this.animations[1] );
        this.currentAction = this.idleAction;
        this.idleAction.play();
    }
        

    setupMixer = ()=> {
        this.mixer = new THREE.AnimationMixer(this.model);
    }

    

    addToScene(scene){
        scene.add(this.model);
    }

    updateName(name){
        this.charName = name;
        this.tooltipDiv.textContent = name;
    }

    removeFromScene(scene){
        window.scene.remove(this.model);
        this.tooltipMesh.parent.remove(this.tooltipMesh);
        
    }

    setupLoader = () => {
        this.loader = new GLTFLoader();
        this.dracoLoader = new DRACOLoader();
        this.dracoLoader.setDecoderPath(
            'https://cdn.obsess-vr.com/charlotte-tilbury/gltf/',
        );
        this.loader.setDRACOLoader(this.dracoLoader);
        this.loader.crossOrigin = true;
    }

}