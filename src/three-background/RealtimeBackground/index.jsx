import React, { useEffect, useState, useRef } from 'react';
// import * as THREE from 'three';
import ThreeController from '../../three-controls/ThreeController';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import {resetRenderer, setUpEnvMap, loadModelAndAnimations} from '../threeHelpers';
import AvatarCreatorContainer from './AvatarCreatorContainer';
import JoystickControls from '../../three-controls/JoystickControls';


// import { Octree } from 'three/examples/jsm/math/Octree';
// import { Capsule } from 'three/examples/jsm/math/Capsule';

let adjustHotspots = ()=> {
    // alert('adjustHotspots');
    window.scene.children.filter((i)=>i.type=='Sprite' || i.type=='mesh' ).forEach((i)=>{
        i.material.depthTest=true;
        // i.position.y+=3;
        // i.position.x+=2;
        // i.position.z+=2;
    });
    // window.store.position.y = -7;
    // window.model.position.y = -7;

    // window.store.position.x = -5;
    // window.model.position.x = -5;

}




const RealtimeBackground = ({ scene, renderer,camera, backgroundUrl }) => {


    const [avatar, setAvatar] = useState(null);
    const [room, setRoom] = useState(null);
    const [charControls, setCharControls] = useState(null);

    useEffect(() => {
        let roomObj = null;
        
        
        //transform into promise
        setUpEnvMap(scene);
        
        // TODO: transform into promises
        
        let loader = new GLTFLoader();
		loader.crossOrigin = true;

        
        function loadStore () {
            return new Promise((resolve, reject) => {
                loader.load("https://cdn.obsess-vr.com/realtime3d/CharlotteTilbury_scene_v005.glb",(data) => {
                // loader.load("https://cdn.obsess-vr.com/realtime3d/Armani_GlowRoom_v036.glb",(data) => {
                    // loader.load("https://cdn.obsess-vr.com/realtime3d/Armani_GlowRoom_v026.glb",(data) => {
                    
                    data.scene.traverse((i)=>{
                        i.material && (i.material.envMapIntensity = 1.5);
                    });


                    roomObj = data.scene;
                    setRoom(data.scene);

                    if(room & avatar) {
                        charControls.setUpCollisionDetection();
                    }
                    scene.add(data.scene);
                    data.scene.scale.set(140,140,140)

                    window.store = data.scene;
                    resolve();
                })
            })
        }

        async function loadStoreAndModel() {

            let [_,modelMixerMap] = await Promise.all([loadStore(), loadModelAndAnimations()]);

            let [model, mixer, animationsMap ] = modelMixerMap;
            let controls = ThreeController.setupCharacterControls(model, mixer, animationsMap);
            setCharControls(controls);
            controls.setUpCollisionDetection();
            scene.add(model);
            setAvatar(model);
        }

        loadStoreAndModel();
        
        
        // loadStore();
        

            
        return () => {
            scene.remove(roomObj)
            scene.remove(model)

            resetRenderer(renderer);


            window.characterControls.removeEvents();

        };
    }, [backgroundUrl]);


    return (
        <>
        { 
        avatar && <AvatarCreatorContainer avatar={avatar} scene={scene} avatarPos={avatar.position} /> && adjustHotspots()}
		{avatar && charControls && <JoystickControls scene={scene} camera={camera} renderer={renderer} avatar={avatar} controls={charControls.orbitControl} />}
        </>
    );
};

export default RealtimeBackground;














