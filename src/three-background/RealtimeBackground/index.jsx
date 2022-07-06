import React, { useEffect, useState, useRef } from 'react';
import * as THREE from 'three';
import ThreeController from '../../three-controls/ThreeController';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import {resetRenderer, setUpEnvMap, loadModelAndAnimations} from '../threeHelpers';
import AvatarCreatorContainer from './AvatarCreatorContainer';

const RealtimeBackground = ({ scene, renderer, backgroundUrl }) => {


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

        async function loadMyModelAndConnectControls() {
            let [model, mixer, animationsMap ] = await loadModelAndAnimations();
            let controls = ThreeController.setupCharacterControls(model, mixer, animationsMap);
            setCharControls(controls);
            if(room & avatar) {
                charControls.setUpCollisionDetection();
            }
            scene.add(model);
            setAvatar(model);
        }
        loadMyModelAndConnectControls();
        
        loader.load("https://cdn.obsess-vr.com/realtime3d/Armani_GlowRoom_v036.glb",(data) => {
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

            })
            
        return () => {
            scene.remove(roomObj)
            scene.remove(model)

            resetRenderer(renderer);


            window.characterControls.removeEvents();

        };
    }, [backgroundUrl]);



    return (
        <>
        {avatar && <AvatarCreatorContainer avatar={avatar} scene={scene} avatarPos={avatar.position} />}
        </>
    );
};

export default RealtimeBackground;















