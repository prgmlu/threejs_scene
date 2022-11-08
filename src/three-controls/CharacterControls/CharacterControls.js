import * as THREE from 'three'
import { Geometry } from 'three/examples/jsm/deprecated/Geometry'
import { createBoundingObjs, offsetBoundingObjs } from '../../three-background/threeHelpers';

import { Octree } from 'three/examples/jsm/math/Octree';
import { Capsule } from 'three/examples/jsm/math/Capsule';
import { OctreeHelper } from "./OctreeHelper";

import CentralMultipleCharControl from './CentralMultipleCharControl';

import { ANIMATION_NAMES } from './Constants';

window.ANIMATION_NAMES = ANIMATION_NAMES;

import { RELEVANT_STORE_PARTS_NAMES } from '../../three-background/RealtimeBackground/avatar-creator/CustomizationConstants';

let areaNames = [
    "entry_area",
    "kate_area",
    "lily_area",
    "jourdan_area",
    "castle_area"
];



// CONSTANTS
const FADE_DURATION = .4;
const WALK_VELOCITY = 3;
const DIRECTIONS = ['w', 'a', 's', 'd', 'arrowup', 'arrowleft', 'arrowdown', 'arrowright'];

const OLD_COLLISION_METHOD = false;


export const ApproxAtan = (z)=>
{
    const n1 = 0.97239411;
    const n2 = -0.19194795;
    return (n1 + n2 * z * z) * z;
}


export const ApproxAtan2 = ( y,  x) =>
{
    if (x != 0.0)
    {
        if (Math.abs(x) > Math.abs(y))
        {
            const  z = y / x;
            if (x > 0.0)
            {
                // atan2(y,x) = atan(y/x) if x > 0
                return ApproxAtan(z);
            }
            else if (y >= 0.0)
            {
                // atan2(y,x) = atan(y/x) + PI if x < 0, y >= 0
                return ApproxAtan(z) + Math.PI;
            }
            else
            {
                // atan2(y,x) = atan(y/x) - Math.PI if x < 0, y < 0
                return ApproxAtan(z) - Math.PI;
            }
        }
        else // Use property atan(y/x) = Math.PI/2 - atan(x/y) if |y/x| > 1.
        {
            const  z = x / y;
            if (y > 0.0)
            {
                // atan2(y,x) = PI/2 - atan(x/y) if |y/x| > 1, y > 0
                return -ApproxAtan(z) + Math.PI/2;
            }
            else
            {
                // atan2(y,x) = -PI/2 - atan(x/y) if |y/x| > 1, y < 0
                return -ApproxAtan(z) - Math.PI/2;
            }
        }
    }
    else
    {
        if (y > 0.0) // x = 0, y > 0
        {
            return Math.PI/2;
        }
        else if (y < 0.0) // x = 0, y < 0
        {
            return -Math.PI/2;
        }
    }
    return 0.0; // x,y = 0. Could return NaN instead.
}



export default class CharacterControls {

    constructor(models, charMixers, animationsMaps, orbitControl, camera, currentAction = ANIMATION_NAMES['idle'] , collisionDetection, items, animated=true, detectCollisions=true, handleIndicators=false, storeMixer, directionValues,localAvatarNameRef,femaleLocalAvatarOutfitStringRef, maleLocalAvatarOutfitStringRef, visibleGenderRef,toAddObjsRef,stopAvatarAnimationLoopRef, scene){
        console.log("CharacterControls constructor")
        this.model = models[0];
        this.models = models;

        this.enabled = true;
        this.joystickBroadcast = directionValues;

        this.scene = scene;
        this.camera = camera;

        this.isWaving = false;

        

        // else{
            let start = model.position.clone();
            let end = model.position.clone();
            start.y = .2;
            end.y = 1;
            this.playerCollider = new Capsule(start,end,0.45);

            console.log('before octree')
            this.setupOctree();

            for(let i = 0; i < areaNames.length; i++){
                let area = window.store.getObjectByName(areaNames[i]);
                if(area){
                    area.visible = false;
                }
            }



            // this.octreeHelper = new OctreeHelper(this.worldOctree);
            // this.scene.add(this.octreeHelper)


            // this.worldOctrees = [];
            // for (let i = 0; i < window.store.children.length; i++) {
            //     let octree = new Octree();
            //     octree.fromGraphNode(window.store.children[i]);
            //     this.worldOctrees.push(octree);
            // }

            // this.octreeHelpers = [];
            // window.trees = this.octreeHelpers;
            // for (let i = 0; i < this.worldOctrees.length; i++) {
            //     let octreeHelper = new OctreeHelper(this.worldOctrees[i]);
            //     this.octreeHelpers.push(octreeHelper);
            //     this.scene.add(this.octreeHelpers[i]);
            // }
        // }


        this.charMixers = charMixers;

        this.charMixers.forEach((i)=>{i.addEventListener(
            'finished',
            (e) => {
                if( (e.action == (this.animationsMaps[0].get(ANIMATION_NAMES['wave']))) || ((e.action == this.animationsMaps[1].get(ANIMATION_NAMES['wave'])))){
                    this.isWaving = false;
                }

                if( (e.action == (this.animationsMaps[0].get(ANIMATION_NAMES['jump'])) || (e.action == (this.animationsMaps[1].get(ANIMATION_NAMES['jump']))) )
                ){
                    this.isJumping = false;
                }
                if( (e.action == (this.animationsMaps[0].get(ANIMATION_NAMES['talk'])) || (e.action == (this.animationsMaps[1].get(ANIMATION_NAMES['talk']))) )
                ){
                    this.isTalking = false;
                }
            }
        )
        })



        this.storeMixer = storeMixer;
        this.animationsMap = animationsMaps[0];
        this.animationsMaps = animationsMaps;
        this.currentAction = currentAction;

        this.animated = animated;
        this.detectCollisions = detectCollisions;
        // this.clock = new THREE.Clock();

        this.handleIndicators = handleIndicators;
        

        
        if(animated){
            this.animationsMaps[0].forEach((value, key) => {
                if (key == this.currentAction) {
                    value.play();
                }
            })
            this.animationsMaps[1].forEach((value, key) => {
                if (key == currentAction) {
                    value.play();
                }
            })
        }
        this.orbitControl = orbitControl;

        this.camera = camera;
        this.items = items;

        this.walkDirection = new THREE.Vector3();
        this.rotateAngle = new THREE.Vector3(0, 1, 0);
        this.rotateQuarternion = new THREE.Quaternion();
        this.cameraTarget = new THREE.Vector3();

        this.lastSafePlace = model.position.clone();
        this.path = [model.position.clone()];

        this.orbitControl.rotateLeft(-1.5);
        this.orbitControl.rotateUp(-1.7)
        this.updateCameraTarget(this.model.position.x,this.model.position.z);
        

        // state
        this.toggleRun = false;
        this.currentAction = currentAction;


        // control keys
		this.keysPressed = {};
		document.addEventListener('keydown', this.handleKeydown, false);
		document.addEventListener('keyup', this.handleKeyup, false);

        this.CentralMultipleCharControl = new CentralMultipleCharControl(this,[],localAvatarNameRef, femaleLocalAvatarOutfitStringRef,maleLocalAvatarOutfitStringRef, visibleGenderRef,toAddObjsRef,stopAvatarAnimationLoopRef, this.scene, this.camera);



        // this.update();

    }

    setupOctree(){

        this.worldOctree = new Octree();
        try{
            this.worldOctree.fromGraphNode(window.store.getObjectByName(RELEVANT_STORE_PARTS_NAMES[0]));
            window.store.getObjectByName(RELEVANT_STORE_PARTS_NAMES[0]).visible = false;
            this.octreeReady = true;
        }
        catch(e){
            try{
                this.worldOctree.fromGraphNode(window.store)
                this.octreeReady = true;

            }
            catch{
                console.log("error in octree creation");

            }
        }

        console.log('after octree')


    }

    isUserClicking(){
        let keyBoardClicks = DIRECTIONS.some(key => this.keysPressed[key] == true);
        if(this.joystickBroadcast){
            var joyStickClicks = this.joystickBroadcast.some(key => key!=0);
        }
        return keyBoardClicks || joyStickClicks;


    }


    getMovesFromDirectionClick(directionOffset,angleYCameraDirection, updateDelta){

            // rotate model
            this.rotateQuarternion.setFromAxisAngle(this.rotateAngle, angleYCameraDirection + directionOffset)
            this.models.forEach((i)=>i.quaternion.rotateTowards(this.rotateQuarternion, .1));

            // calculate direction
            //walk direction is the same as the camera direction
            //but we need to set the y to 0 so it doesnt move up

            //UPDATE actually no need to set y to 0 since we only update the X and Y only anyway.
            this.camera.getWorldDirection(this.walkDirection)
            // this.walkDirection.y = 0
            // this.walkDirection.normalize()
            this.walkDirection.applyAxisAngle(this.rotateAngle, directionOffset)

            // move model & camera
            const moveX = this.walkDirection.x * WALK_VELOCITY * updateDelta
            const moveZ = this.walkDirection.z * WALK_VELOCITY * updateDelta

            return [moveX, moveZ]
    }
    


    handleCollision(moveX, moveZ){
        this.models.forEach((i)=>i.position.x -=  (1* moveX));
        this.models.forEach((i)=>i.position.z -=  (1* moveZ));
        // this.goToLastSafePlace();
    }

    handleIndicators(){
        for(let i=0; i<this.items.length; i++){
            if(this.items.items[i].interact){
                let itemPos = new THREE.Vector3(this.items.items[i].position.x, this.items.items[i].position.y, this.items.items[i].position.z);
                let distFromChar = itemPos.distanceTo(this.model.position);
                if(distFromChar < 2){
                    this.items.items[i].indicator.visible = true;
                }
                else{
                    this.items.items[i].indicator.visible = false;
                }
            }
        }
    }

    checkForCollisions (){
        
        let collisionHappened = false;

        }

    setEnabled(val){
        this.enabled = val;
    }

    handleKeydown = (e) => {
        this.enabled && ((this.keysPressed)[e.key.toLowerCase()] = true);

        if(e.key == " "){
            // this.playWaveAnimation();
            // this.isWaving = true;
            this.playJumpAnimation();
            this.isJumping = true;
        }

        if(e.key == "t"){
            // this.playWaveAnimation();
            // this.isWaving = true;
            this.playTalkAnimation();
            this.isTalking = true;
        }

    }

    removeEvents = () => {
        document.removeEventListener('keydown', this.handleKeydown, false);
        document.removeEventListener('keyup', this.handleKeyup, false);

        this.keysPressed = {};
    }

    playJumpAnimation(){
        if(this.isJumping) return;
        try{

            let c = this.animationsMaps[0].get(ANIMATION_NAMES.jump);
            c.setLoop(THREE.LoopOnce);
            c.reset().play();
        }
        catch(e){
            console.log(e);
        }

        try{

            let d = this.animationsMaps[1].get(ANIMATION_NAMES.jump);
            d.setLoop(THREE.LoopOnce);
            d.reset().play();
        }
        catch(e){
            console.log(e);
        }

    }

    playTalkAnimation(){
        if(this.isTalking) return;
        try{

            let c = this.animationsMaps[0].get(ANIMATION_NAMES.talk);
            c.setLoop(THREE.LoopOnce);
            c.reset().play();
        }
        catch(e){
            console.log(e);
        }

        try{

            let d = this.animationsMaps[1].get(ANIMATION_NAMES.talk);
            d.setLoop(THREE.LoopOnce);
            d.reset().play();
        }
        catch(e){
            console.log(e);
        }

    }

    playWaveAnimation(){
        try{

            let c = this.animationsMaps[0].get(ANIMATION_NAMES.wave);
            c.setLoop(THREE.LoopOnce);
            c.reset().play();
        }
        catch(e){
            console.log(e);
        }
        try{

            let d = this.animationsMaps[1].get(ANIMATION_NAMES.wave);
            d.setLoop(THREE.LoopOnce);
            d.reset().play();
        }
        catch(e){
            console.log(e);
        }

    }
    
    handleKeyup = (e) => {
            this.enabled && ((this.keysPressed)[e.key.toLowerCase()] = false);
        }


    removeEvents = () => {
        document.removeEventListener('keydown',this.handleKeydown)
        document.removeEventListener('keyup',this.handleKeyup)

        this.orbitControl.object.position.set(.1,0,0)

        this.orbitControl.minDistance = 0;
        this.orbitControl.maxDistance = 10;
        this.orbitControl.maxPolarAngle = 2;

    }

    setLastSafePlaceAndAddToPath = () => {
        if(this.path.length>1){
            this.lastSafePlace = this.path[this.path.length-2].clone();
        }
        else{
            this.lastSafePlace = this.model.position.clone();
        }
        
        this.path.push(this.model.position.clone());
    }

    goToLastSafePlace = () => {
        let jumpLength = 10;
        // if(this.path.length<jumpLength){
        if(true){

            this.model.position.copy(this.lastSafePlace.clone());
            offsetBoundingObjs(this.model.position, this.model.boundingObjs);
            
            // this.model.boundingObjs.forEach((i)=>{
                //     i.position.copy(this.model.position);
                // });
        }
        else{

            this.model.position.copy(this.path[this.path.length-jumpLength].clone());
            offsetBoundingObjs(this.path[this.path.length-jumpLength].clone(), this.model.boundingObjs);
        }
    }

    update = (updateDelta) => {
        // requestAnimationFrame(this.update);

        // let updateDelta = this.clock.getDelta();
        const isWalking = this.isUserClicking()
        this.isWalking = isWalking;
        
        if(this.animated){
            let newAction = isWalking? ANIMATION_NAMES['walk'] : ANIMATION_NAMES['idle'];
            if (this.currentAction != newAction) {
                const toPlay = this.animationsMaps[0].get(newAction);
                const current = this.animationsMaps[0].get(this.currentAction);
                
                current.fadeOut(FADE_DURATION);
                toPlay.reset().fadeIn(FADE_DURATION).play();
                
                
                const toPlay2 = this.animationsMaps[1].get(newAction);
                const current2 = this.animationsMaps[1].get(this.currentAction);
                
                current2.fadeOut(FADE_DURATION);
                toPlay2.reset().fadeIn(FADE_DURATION).play();
                
                this.currentAction = newAction;
            }
            this.charMixers.forEach((i)=>i.update(updateDelta));
            try{
                this.storeMixer.update(updateDelta)
            }
            catch(e){
                console.log(e);
            }

        }

        if (this.currentAction == ANIMATION_NAMES['walk'] || isWalking) {
            // calculate towards camera direction
            var angleYCameraDirection = Math.PI + ApproxAtan2(
                    (this.camera.position.x - this.model.position.x), 
                    (this.camera.position.z - this.model.position.z))
            // diagonal movement angle offset
            var directionOffset = this.directionOffset(this.keysPressed)

            let [moveX, moveZ] = this.getMovesFromDirectionClick(directionOffset, angleYCameraDirection, updateDelta);
            window.hasMoved = true;

            document.querySelector('#tooltipsJoystick').style.display='none';
            clearTimeout(window.tooltipTimer);

            this.models.forEach((i)=>i.position.x += moveX);
            this.models.forEach((i)=>i.position.z += moveZ);
            
            // else{
                this.playerCollider .start.x = this.model.position.x;
                this.playerCollider .start.z = this.model.position.z;
                this.playerCollider .end.x = this.model.position.x;
                this.playerCollider .end.z = this.model.position.z;
            // }

            let result ;
            try{
                result = this.worldOctree.capsuleIntersect( this.playerCollider );
            }
            catch(e){
                console.log(e);
            }

            // const results = [];
            // for(let i=0; i<this.worldOctrees.length; i++){
            //     results.push(this.worldOctrees[i].capsuleIntersect(this.playerCollider));
            // }

            // let result = results[0]; 
            
            let collisionHappened = false;
            if(this.detectCollisions){
                // if(false){
                    // collisionHappened = this.checkForCollisions();
                }
                // if(this.detectCollisions && collisionHappened){
                        if(result && (Math.abs(result.normal.x) >.7 || Math.abs(result.normal.z)>.7)){ 
                            this.handleCollision(moveX, moveZ);
                    return;
            }
            else{
                //if im not detecting collisions, or no collisions happened
                this.updateCameraTarget(moveX, moveZ);
                // this.setLastSafePlaceAndAddToPath();
            }

            if(this.showIndicators){
                this.handleIndicators();
            }
        }
        this.orbitControl.update();
    }

    updateCameraTarget(moveX, moveZ){
        // move camera
        this.camera.position.x += moveX
        this.camera.position.z += moveZ

        // update camera target
        this.cameraTarget.x = this.model.position.x
        this.cameraTarget.y = this.model.position.y + 1
        this.cameraTarget.z = this.model.position.z
        this.orbitControl.target = this.cameraTarget
    }

    directionOffset(keysPressed){
        var directionOffset = 0 // w

        if(this.joystickBroadcast && (this.joystickBroadcast[0] //up
        || this.joystickBroadcast[1] //down
        || this.joystickBroadcast[2] //left
        || this.joystickBroadcast[3])){ //right
            let x = (this.joystickBroadcast[0] || this.joystickBroadcast[1]);
            let y = (this.joystickBroadcast[2] || this.joystickBroadcast[3]);
            return -Math.atan2(y, x);
        }



        

        if (keysPressed['w'] || keysPressed['arrowup'] ) {
            if (keysPressed['a'] || keysPressed['arrowleft'] ) {
                directionOffset = Math.PI / 4 // w+a
            } else if (keysPressed['d'] || keysPressed['arrowright'] ) {
                directionOffset = - Math.PI / 4 // w+d
            }
        } else if (keysPressed['s'] || keysPressed['arrowdown'] ) {
            if (keysPressed['a'] || keysPressed['arrowleft'] ) {
                directionOffset = Math.PI / 4 + Math.PI / 2 // s+a
            } else if (keysPressed['d'] || keysPressed['arrowright'] ) {
                directionOffset = -Math.PI / 4 - Math.PI / 2 // s+d
            } else {
                directionOffset = Math.PI // s
            }
        } else if (keysPressed['a'] || keysPressed['arrowleft'] ) {
            directionOffset = Math.PI / 2 // a
        } else if (keysPressed['d'] || keysPressed['arrowright'] ) {
            directionOffset = - Math.PI / 2 // d
        }

        return directionOffset
    }
}