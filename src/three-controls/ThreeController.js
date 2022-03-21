import * as THREE from 'three';
import OrbitControls from './OrbitControls';

class ThreeController {
    setupControls(camera, renderer) {
        this.startDistance = null;
        this.camera = camera;
        this.controls = new OrbitControls(this.camera, renderer.domElement);
        // renderer.domElement.addEventListener('touchstart', (event)=>{
        // if (event.touches.length != 1) {
        //     event.preventDefault();
        // }

        // if (event.touches.length === 2) {
        //     var base = Math.abs(event.touches[0].pageX - event.touches[1].pageX);
        //     var height = Math.abs(event.touches[0].pageY - event.touches[1].pageY);
        //     var dist = Math.sqrt((base ** 2) + (height ** 2));

        //     this.startDistance = dist;
        // }

        // })

        if(!window.counter){
            window.counter = 1
        }
        else{
            window.counter+=1;
        }

        if (window.counter>1){
        renderer.domElement.addEventListener('touchend', (event)=>{
            this.startDistance = null;
        }, {passive: true})
        renderer.domElement.addEventListener('touchmove', (event)=>{

        if (event.touches.length != 1) {
            event.preventDefault();
        }

        if (event.touches.length === 2) {
            var base = Math.abs(event.touches[1].pageX - event.touches[0].pageX);
            var height = Math.abs(event.touches[1].pageY - event.touches[0].pageY);
            var dist = Math.sqrt((base ** 2) + (height ** 2));
            var deltaDist = this.startDistance - dist;
            var temp = this.camera.fov + (deltaDist * .2);
            // this.camera.position.x+=1;

            if (temp > 20 && temp < 70) {
                this.camera.fov += deltaDist * .2;
                this.camera.updateProjectionMatrix();
            }

            this.startDistance = dist;
        }

        // if (!this.deviceOrientationEventFired) {
        //     this.deviceOrientationHandler(event);
        // }
        }, {passive: true});
    }



        window.c=this.controls;
        // this.controls.enableDamping = true;
        // this.controls.dampingFactor = 0.05;
        // this.controls.enableKeys = false;
        // this.controls.enableZoom = true;
        // window.c = this.controls;
        this.controls.maxDistance = .1;
        this.controls.minDistance =0;


        return this.controls;
    }

    setupPanControls() {
        // this.controls.enablePan = true;
        // this.controls.enableRotate = false;
        // this.controls.panSpeed = 100;
        // this.controls.mouseButtons.LEFT = THREE.MOUSE.PAN;
        // this.controls.mouseButtons.RIGHT = THREE.MOUSE.DOLLY;
        // this.controls.screenSpacePanning = true;

        return this.controls;
    }

    setupRotateControls() {
        // this.controls.enableRotate = true;
        // // this.controls.enablePan = false;
        // this.controls.rotateSpeed = 0.3;
        // this.controls.maxPolarAngle = Math.PI;

        return this.controls;
    }
}

export default new ThreeController();
