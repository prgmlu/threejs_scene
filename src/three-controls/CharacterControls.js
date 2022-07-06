import * as THREE from 'three'
import { Geometry } from 'three/examples/jsm/deprecated/Geometry'
import CollisionDetection from './CollisionDetection';
import { createBoundingObj } from '../three-background/threeHelpers';

const createCube = function () {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    window.cube = cube;
    cube.scale.set(1,1,1);
    // cube.position.x=-5.2;
    // cube.position.y=-5.2;
    cube.position.set(0, 0, 5)
    return cube
}


// CONSTANTS
const FADE_DURATION = 0.2;
const WALK_VELOCITY = 3;
const DIRECTIONS = ['w', 'a', 's', 'd', 'arrowup', 'arrowleft', 'arrowdown', 'arrowright'];

function getStoreParts(){
    debugger;
    let p = [];
    window.store.traverse((i)=>{
        p.push(i)
    })
    window.p = p;
    return p;
}

export default class CharacterControls {

    constructor(model, mixer, animationsMap, orbitControl, camera, currentAction = 'Idle' , collisionDetection, items, animated=true, detectCollisions=true){
        this.model = model;

        this.model.boundingObj = createBoundingObj(this.model.position);
        scene.add(this.model.boundingObj);

        // this.cube = createCube();
        // scene.add(this.cube);
        // this.cube.position.set(0, 0, 0)
        // this.cube.material.depthTest=false;




        this.boundingGeometry = new Geometry().fromBufferGeometry(this.model.boundingObj.geometry);
        this.mixer = mixer;
        this.animationsMap = animationsMap;
        this.currentAction = currentAction;

		this.collisionDetection = new CollisionDetection([]);
        // this.collisionDetection.setCollisionObjects(getStoreParts());

        this.animated = animated;
        this.detectCollisions = detectCollisions;
        this.update = this.update.bind(this);
        this.clock = new THREE.Clock();
        

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

        this.updateCameraTarget(this.model.position.x,this.model.position.z);
        

        // state
        this.toggleRun = false;
        this.currentAction = currentAction;


        // control keys
		this.keysPressed = {};
		document.addEventListener('keydown', this.handleKeydown, false);
		document.addEventListener('keyup', this.handleKeyup, false);


        this.update();

    }

    setUpCollisionDetection(){
        this.collisionDetection.setCollisionObjects(getStoreParts());
    }

    handleKeydown = (e) => {
        (this.keysPressed)[e.key.toLowerCase()] = true;
    }
    handleKeyup = (e) => {
            (this.keysPressed)[e.key.toLowerCase()] = false;
        }

    removeEvents = () => {
        document.removeEventListener('keydown',this.handleKeydown)
        document.removeEventListener('keyup',this.handleKeyup)

        this.orbitControl.minDistance = 0;
        this.orbitControl.maxDistance = .1;
        this.orbitControl.maxPolarAngle = 2;

    }

    setLastSafePlace = () => {
        this.lastSafePlace = this.model.position.clone();
    }

    goToLastSafePlace = () => {
        this.model.position.copy(this.lastSafePlace.clone());
    }

    update = () => {

        window.requestAnimationFrame(this.update);
        let updateDelta = this.clock.getDelta();
        const directionPressed = DIRECTIONS.some(key => this.keysPressed[key] == true);
        if(this.animated){
            let newAction = directionPressed? 'Walking' : 'Idle';
            if (this.currentAction != newAction) {
                const toPlay = this.animationsMap.get(newAction);
                const current = this.animationsMap.get(this.currentAction);
                
                current.fadeOut(FADE_DURATION);
                toPlay.reset().fadeIn(FADE_DURATION).play();
                
                this.currentAction = newAction;
            }
            this.mixer.update(updateDelta)
        }

        if (this.currentAction == 'Walking' || directionPressed) {
            // calculate towards camera direction
            var angleYCameraDirection = Math.PI + Math.atan2(
                    (this.camera.position.x - this.model.position.x), 
                    (this.camera.position.z - this.model.position.z))
            // diagonal movement angle offset
            var directionOffset = this.directionOffset(this.keysPressed)

            // rotate model
            this.rotateQuarternion.setFromAxisAngle(this.rotateAngle, angleYCameraDirection + directionOffset)
            this.model.quaternion.rotateTowards(this.rotateQuarternion, .1)

            // calculate direction
            this.camera.getWorldDirection(this.walkDirection)
            this.walkDirection.y = 0
            this.walkDirection.normalize()
            this.walkDirection.applyAxisAngle(this.rotateAngle, directionOffset)

            // move model & camera
            const moveX = this.walkDirection.x * WALK_VELOCITY * updateDelta
            const moveZ = this.walkDirection.z * WALK_VELOCITY * updateDelta


            this.model.position.x += moveX
            this.model.position.z += moveZ
            
            this.model.boundingObj.position.x += moveX
            this.model.boundingObj.position.z += moveZ

            if(this.detectCollisions){
                
                var collisionHappened = this.collisionDetection.detectCollision(this.boundingGeometry, this.model.boundingObj.matrix, this.model.boundingObj.position);
                // var collisionHappened = false;
            }
                if(this.detectCollisions && collisionHappened){
            // if(false){
                this.model.position.x -= moveX
                this.model.position.z -= moveZ
                this.model.boundingObj.position.x -= moveX
                this.model.boundingObj.position.z -= moveZ
                this.goToLastSafePlace();
                return;
            }
            else{
                this.updateCameraTarget(moveX, moveZ);
                this.setLastSafePlace();
            }

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

        if (keysPressed['w'] || keysPressed['arrowup']) {
            if (keysPressed['a'] || keysPressed['arrowleft']) {
                directionOffset = Math.PI / 4 // w+a
            } else if (keysPressed['d'] || keysPressed['arrowright']) {
                directionOffset = - Math.PI / 4 // w+d
            }
        } else if (keysPressed['s'] || keysPressed['arrowdown']) {
            if (keysPressed['a'] || keysPressed['arrowleft']) {
                directionOffset = Math.PI / 4 + Math.PI / 2 // s+a
            } else if (keysPressed['d'] || keysPressed['arrowright']) {
                directionOffset = -Math.PI / 4 - Math.PI / 2 // s+d
            } else {
                directionOffset = Math.PI // s
            }
        } else if (keysPressed['a'] || keysPressed['arrowleft']) {
            directionOffset = Math.PI / 2 // a
        } else if (keysPressed['d'] || keysPressed['arrowright']) {
            directionOffset = - Math.PI / 2 // d
        }

        return directionOffset
    }
}