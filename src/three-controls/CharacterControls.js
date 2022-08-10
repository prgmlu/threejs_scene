import * as THREE from 'three'
window.THREE = THREE;
import { Geometry } from 'three/examples/jsm/deprecated/Geometry'
import CollisionDetection from './CollisionDetection';
import { createBoundingObjs, offsetBoundingObjs , getStoreParts} from '../three-background/threeHelpers';

import { Octree } from 'three/examples/jsm/math/Octree';
import { Capsule } from 'three/examples/jsm/math/Capsule';
import { OctreeHelper } from "./OctreeHelper";
import {ApproxAtan2} from './helpers';

import CentralMultipleCharControl from './CentralMultipleCharControl';

import { ANIMATION_NAMES } from './Constants';



// CONSTANTS
const FADE_DURATION = .4;
const WALK_VELOCITY = 3;
const DIRECTIONS = ['w', 'a', 's', 'd', 'arrowup', 'arrowleft', 'arrowdown', 'arrowright'];

const OLD_COLLISION_METHOD = false;



export default class CharacterControls {

    constructor(model, charMixer, animationsMap, orbitControl, camera, currentAction = ANIMATION_NAMES['idle'] , collisionDetection, items, animated=true, detectCollisions=true, handleIndicators=false, storeMixer, directionValues){
        this.model = model;

        this.enabled = true;
        this.joystickBroadcast = directionValues;

        if(OLD_COLLISION_METHOD){
            //array of bounding objs
            this.model.boundingObjs = createBoundingObjs(this.model.position);
            window.boundingObjs = this.model.boundingObjs;
            
            this.model.boundingObjs.forEach((i)=>{
                scene.add(i);
            })


            this.playerCollider = new Capsule( new THREE.Vector3( 0, 0.35 , 0 ), new THREE.Vector3( 0, 1, 0 ), 2 );
            window.playerCollider = this.playerCollider;

        }
        
        // else{
            let start = model.position.clone();
            let end = model.position.clone();
            start.y = .2;
            end.y = 1;
            this.playerCollider = new Capsule(start,end,0.45);

            window.playerCollider = this.playerCollider;

            this.worldOctree = new Octree();
            this.worldOctree.fromGraphNode(window.store.getObjectByName('SceneDesign'));
            // this.octreeHelper = new OctreeHelper(this.worldOctree);
            // window.scene.add(this.octreeHelper)


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
            //     window.scene.add(this.octreeHelpers[i]);
            // }



            window.worldOctree = this.worldOctree;
        // }


        this.charMixer = charMixer;
        this.storeMixer = storeMixer;
        this.animationsMap = animationsMap;
        this.currentAction = currentAction;

		this.collisionDetection = new CollisionDetection([]);

        this.animated = animated;
        this.detectCollisions = detectCollisions;
        // this.clock = new THREE.Clock();

        this.handleIndicators = handleIndicators;
        

        window.u = this.update;
        
        if(animated){
            this.animationsMap.forEach((value, key) => {
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
        window.path = this.path;

        this.updateCameraTarget(this.model.position.x,this.model.position.z);
        this.orbitControl.rotateLeft(-1.6);
        this.orbitControl.rotateUp(.9)
        

        // state
        this.toggleRun = false;
        this.currentAction = currentAction;


        // control keys
		this.keysPressed = {};
		document.addEventListener('keydown', this.handleKeydown, false);
		document.addEventListener('keyup', this.handleKeyup, false);


        this.CentralMultipleCharControl = new CentralMultipleCharControl(this,[]);



        // this.update();

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
            this.model.quaternion.rotateTowards(this.rotateQuarternion, .1)

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
        this.model.position.x -=  (1* moveX)
        this.model.position.z -=  (1* moveZ)
        
        if(OLD_COLLISION_METHOD){
            this.model.boundingObjs.forEach((i)=>{
                i.position.x -=  (1* moveX);
                i.position.z -=  (1* moveZ);
                i.rotation.x+=Math.random()*.1;
                i.rotation.y+=Math.random()*.1;
                i.rotation.z+=Math.random()*.1;
            })
        }

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

        if(OLD_COLLISION_METHOD){
            for(var i=0; i<this.model.boundingObjs.length; i++){
                let boundingObj = this.model.boundingObjs[i];
                this.boundingGeometry = new Geometry().fromBufferGeometry(boundingObj.geometry);
                collisionHappened = this.collisionDetection.detectCollision(this.boundingGeometry, boundingObj.matrix, boundingObj.position);
                if(collisionHappened){
                    return true;
                }
            }
        }
        else{

        }
    }

    setUpCollisionDetection(){
        this.collisionDetection.setCollisionObjects(getStoreParts());
    }

    setEnabled(val){
        this.enabled = val;
    }

    handleKeydown = (e) => {
        this.enabled && ((this.keysPressed)[e.key.toLowerCase()] = true);

        if(e.key == " "){
            this.playWaveAnimation();
        }

    }
    playWaveAnimation(){
        debugger;
        let c = this.animationsMap.get(ANIMATION_NAMES.wave);
        c.reset()
        c.setLoop(THREE.LoopPingPong,1);
        c.play();
        // c.fadeOut(.5);

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
        // window.requestAnimationFrame(this.update);

        // let updateDelta = this.clock.getDelta();
        const isWalking = this.isUserClicking()
        this.isWalking = isWalking;
        
        if(this.animated){
            let newAction = isWalking? ANIMATION_NAMES['walk'] : ANIMATION_NAMES['idle'];
            if (this.currentAction != newAction) {
                const toPlay = this.animationsMap.get(newAction);
                const current = this.animationsMap.get(this.currentAction);
                
                current.fadeOut(FADE_DURATION);
                toPlay.reset().fadeIn(FADE_DURATION).play();
                
                this.currentAction = newAction;
            }
            this.charMixer.update(updateDelta)
            this.storeMixer.update(updateDelta)
        }

        if (this.currentAction == ANIMATION_NAMES['walk'] || isWalking) {
            // calculate towards camera direction
            var angleYCameraDirection = Math.PI + ApproxAtan2(
                    (this.camera.position.x - this.model.position.x), 
                    (this.camera.position.z - this.model.position.z))
            // diagonal movement angle offset
            var directionOffset = this.directionOffset(this.keysPressed)

            let [moveX, moveZ] = this.getMovesFromDirectionClick(directionOffset, angleYCameraDirection, updateDelta);

            this.model.position.x += moveX
            this.model.position.z += moveZ
            
            if(OLD_COLLISION_METHOD){

                this.model.boundingObjs.forEach((i)=>{
                    i.position.x += moveX; 
                    i.position.z += moveZ;
                });
            }
            // else{
                this.playerCollider .start.x = this.model.position.x;
                this.playerCollider .start.z = this.model.position.z;
                this.playerCollider .end.x = this.model.position.x;
                this.playerCollider .end.z = this.model.position.z;
            // }

            const result = this.worldOctree.capsuleIntersect( playerCollider );

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