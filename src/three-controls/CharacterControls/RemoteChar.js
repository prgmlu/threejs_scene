import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from '../../../node_modules/three/examples/jsm/loaders/DRACOLoader.js';
import { initCSSRenderer, addToolTipToModel } from './toolTipHelpers';
import { hideAllExceptFirstClothItem } from '../../three-background/threeHelpers';
import { dressUpFromString } from './OutfitTranslator.js';


const FADE_DURATION = .4;

let charTypeMap = {
    "female":{
        url:"https://cdn.obsess-vr.com/realtime3d/BaseFemaleAvatar_Ver9.glb",
        scale: 1,
    },
    "male":{
        url:"https://cdn.obsess-vr.com/realtime3d/BaseMaleAvatar_004_1.glb",
        scale: 1,
    }
}

export default class RemoteChar{
    //will have a Position and Rotation, animations and a mixer.
    // the central control will be always be interpolating between the last position and last rotation and the new position and rotation.
    constructor(charType , position, rotation, address, charName, ADD_TOOLTIP, applyAdjustements=null, outfitString){

        this.animations = null;
        this.mixer = null;
        this.model = null;
        this.position = position;
        this.rotation = rotation;
        this.currentAction = null;
        this.outfitString = outfitString;

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

            this.model.traverse( function ( child ) {
                if ( child.isMesh ) {
                    child.castShadow = true;
                    child.frustumCulled = false;
                    // child.receiveShadow = true;
                }
            } );

            if(this.ADD_TOOLTIP){
                let {div,tooltipMesh } = addToolTipToModel(this.model, this.charName);
                this.tooltipDiv = div;
                this.tooltipMesh = tooltipMesh;
            }

            this.setModelScale();
            // if(this.applyAdjustements){
                //like the envMap
                // hideAllExceptFirstClothItem(this.model);

                dressUpFromString(this.model, this.outfitString);

            // }

            this.setupMixer();
            this.setupAnimations();   
            this.model.visible = false;
            this.addToScene(window.scene);

        });
    }

    playWalkingAnimation(){
        if(this.currentAction === this.walkingAction) return;

        this.idleAction.fadeOut(FADE_DURATION);
        this.walkingAction.reset().fadeIn(FADE_DURATION).play();

        this.currentAction = this.walkingAction;
    }

    playWavingAnimation(){
        this.wavingAction.setLoop(THREE.LoopOnce);
        this.wavingAction.reset().play();

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
        this.wavingAction = this.mixer.clipAction( this.animations[2] );
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