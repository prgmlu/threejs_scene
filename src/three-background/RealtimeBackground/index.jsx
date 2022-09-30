import React, { useEffect, useState, useRef } from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import {resetRenderer, setUpEnvMap, loadModelAndAnimations, setUpNormalLights, setUpSceneBackground, hideAllExceptFirstClothItem} from '../threeHelpers';

import AvatarCreatorContainer from './AvatarCreatorContainer';
import RealtimeControls from './RealtimeControls';
import './output.css';
import { femalePredeterminedOutfitsWithHair,malePredeterminedOutfitsWithHair } from './avatar-creator/predeterminedOutfits';
import { RELEVANT_STORE_PARTS_NAMES } from './avatar-creator/CustomizationConstants';

//import draco loader
import { DRACOLoader } from './DRACOLoader.js';


const STORE_Y_OFFSET = 7;



let hideAllHotspots = (scene) => {

    scene.children.filter((i)=>{return i.name=='marker' || i.name=='visualObject'}).forEach((i)=>{i.visible=false;});
}

let adjustHotspots = (scene) => {

    scene.children.forEach((i) => { if (i.material)
        {
            try{
                // i.material.color.set('red'); i.material.transparent=true; i.material.opacity=.5
            }
            catch{
                null;
            }

        }
})

    
    let keep = [];

    let hotspots = scene.children.filter((i) => {return i.name=='visualObject'});
    keep = hotspots.slice(0, 5);

    let imgHotspotCollider = scene.children.filter((i)=>(i.position.x>2.1 && i.position.x<2.2) && (i.position.y>-1.34 ) && (i.position.y<-1.33))[0];
    keep.push(imgHotspotCollider);


    scene.children.filter((i)=>{return i.name=='marker' || i.name=='visualObject'}).filter((i)=>{return i.position.y<0}).forEach((i,counter)=>{

        // i.visible=false;
        if(!keep.includes(i)){
            scene.remove(i);
        }
    }
    )
    scene.children.filter((i)=>{return i.name=='marker' || i.name=='visualObject'}).filter((i)=>{return i.position.y>.4 && i.position.y<.46 }).forEach((i)=>
    {i.visible=false
        if(!keep.includes(i)){
            scene.remove(i);
        }
        scene.remove(i);
    }
        )

        let p1 = {
            "x": -3.7859341649119185,
            "y": -3.3574198875152925,
            "z": 2.6342166536456495
        };
        
        let p2 = {
            "x": -2.262045371722456,
            "y": -3.1840471812820057,
            "z": -2.1382314862033267
        };
        
        let p3 = {
            "x": 2.3190075711822984,
            "y": -3.3395727798587025,
            "z": -2.6079405506375197
        };
        
        let p4 = {
            "x": 3.745760587020106,
            "y": -3.247059092703031,
            "z": 2.4947902359627814
        };

        let p5 = {
            "x": 3.674265287951267,
            "y": -5.088030871259041,
            "z": 3.546999497832575
        };

        let textureLoader = new THREE.ImageBitmapLoader();
        let texture = null;
        textureLoader.load ( "https://cdn.obsess-vr.com/play-hotspot.png", (imageBitmap) => {
            texture = new THREE.CanvasTexture( imageBitmap );
            // hair.material.map = texture;
            // hair.material.needsUpdate = true
         } );


        setInterval(()=>{
            try{
                let objs = scene.children.filter((i)=>{return (!keep.includes(i)) && (i.name=='marker' || i.name=='visualObject')});
                objs[4] = imgHotspotCollider;
                
                objs [0].position.set(p1.x, p1.y + STORE_Y_OFFSET, p1.z);
                objs [1].position.set(p2.x, p2.y + STORE_Y_OFFSET, p2.z);
                objs [2].position.set(p3.x, p3.y + STORE_Y_OFFSET, p3.z);
                objs [3].position.set(p4.x, p4.y + STORE_Y_OFFSET, p4.z);
                objs [4].position.set(p5.x, p5.y + STORE_Y_OFFSET, p5.z);
                
                keep [0].position.set(p1.x, p1.y + STORE_Y_OFFSET, p1.z);

                if(texture){
                    keep[0].material.map = texture;
                    keep[0].material.needsUpdate = true;

                    keep[1].material.map = texture;
                    keep[1].material.needsUpdate = true;

                    keep[2].material.map = texture;
                    keep[2].material.needsUpdate = true;
                    
                    keep[3].material.map = texture;
                    keep[3].material.needsUpdate = true;
                }

                keep [1].position.set(p2.x, p2.y + STORE_Y_OFFSET, p2.z);
                keep [2].position.set(p3.x, p3.y + STORE_Y_OFFSET, p3.z);
                keep [3].position.set(p4.x, p4.y + STORE_Y_OFFSET, p4.z);
                keep [4].position.set(p5.x, p5.y + STORE_Y_OFFSET, p5.z);
            }
            catch(e) {
                null;
            }
        }, 1000)

}
let removeBottomBar = ()=>{setInterval(()=>{try{document.querySelectorAll('.bottombar-container')[0].remove()}catch{null;}},1000);};

let ENV_MAP_INTENSITY = 2;
let STORE_SCALE = [140,140,140];

function createRandomName(){
    let name = "Guest ";
    let randomNumber = Math.floor(Math.random() * 100);
    name += randomNumber;
    return name;
}

function getInitialAvatarOutfitString(type){
    if(type == 'male'){
        let x = malePredeterminedOutfitsWithHair;
        let randomNumber = Math.floor(Math.random() * Object.keys(malePredeterminedOutfitsWithHair).length);
        return x[randomNumber];
    }
    if(type == 'female'){
        let x = femalePredeterminedOutfitsWithHair;
        let randomNumber = Math.floor(Math.random() * Object.keys(femalePredeterminedOutfitsWithHair).length);
        return x[randomNumber];
    }
}


const RealtimeBackground = ({ scene, renderer,camera, backgroundUrl, controller }) => {
    
    setUpSceneBackground (scene, true);

    let toAddObjsRef = useRef([]);

    window.toAddObjsRef = toAddObjsRef;

    
    const [mAvatar, setMAvatar] = useState(null);
    const [fAvatar, setFAvatar] = useState(null);

    const [maleCharMixer, setMaleCharMixer] = useState(null);
    const [femaleCharMixer, setFemaleCharMixer] = useState(null);

    const [storeMixer, setStoreMixer] = useState(null);
    const [room, setRoom] = useState(null);

    const [maleAnimationsMap, setMaleAnimationsMap] = useState(null);
    const [femaleAnimationsMap, setFemaleAnimationsMap] = useState(null);

    const [charControls, setCharControls] = useState(null);

    const localAvatarNameRef = useRef(createRandomName());
    window.localAvatarNameRef = localAvatarNameRef;

    const visibleGenderRef = useRef("female");

    const femaleLocalAvatarOutfitStringRef = useRef(getInitialAvatarOutfitString('female'));
    window.femaleLocalAvatarOutfitStringRef = femaleLocalAvatarOutfitStringRef;
    
    const maleLocalAvatarOutfitStringRef = useRef(getInitialAvatarOutfitString('male'));
    window.maleLocalAvatarOutfitStringRef = maleLocalAvatarOutfitStringRef;

    let switchAvatar = async (avType) => {
        let url;
        if(avType == 'male'){
            url = maleModelUrl;
        }
        else {
            url = femaleModelUrl;
        }
        let modelMixerMap = await loadModelAndAnimations(url,null,avType);
            let [model,mixer,animMap ] = modelMixerMap ; 
            model.position.set(0,-.8,-2.6);
            setCharMixer(mixer);
            setAnimationsMap(animMap);
            //remove old avatar from scene
            miniScene.remove(avatar);
            setAvatar(model);
            // add new avatar to scene
            // scene.add(model);
            window.miniScene.add(model);
    }

    window.switchAvatar = switchAvatar;



    let handleAnimations = (data)=>{
        let newStoreMixer =  new THREE.AnimationMixer(data.scene);
        data.animations.forEach((anim)=>{
            let action = newStoreMixer.clipAction(anim);
            action.loop = THREE.LoopPingPong;
            action.play();
        })
        setStoreMixer(newStoreMixer);
    }

    // useEffect(() => {
    //     const script = document.createElement('script');
      
    //     script.src = "https://cdn.obsess-vr.com/realtime3d/pleaserotate.js";
    //     script.async = true;
      
    //     document.body.appendChild(script);
      
    //     return () => {
    //       document.body.removeChild(script);
    //     }
    //   }, []);


    useEffect(() => {
        let roomObj = null;
        setUpEnvMap(scene);
        
        let loader = new GLTFLoader();
		loader.crossOrigin = true;

        // draco
        let dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath( 'https://cdn.obsess-vr.com/charlotte-tilbury/gltf/' );
        loader.setDRACOLoader( dracoLoader );

        
        function loadStore () {
            return new Promise((resolve, reject) => {
                // loader.load("https://cdn.obsess-vr.com/realtime3d/CharlotteTilbury_scene_v032.glb",(storeGlb) => {
                loader.load("https://cdn.obsess-vr.com/realtime3d/CT_Holiday2022_v029.glb",(storeGlb) => {
                // loader.load("https://cdn.obsess-vr.com/realtime3d/CharlotteTilbury_sceneAnim_v030.glb",(storeGlb) => {
                // loader.load("https://cdn.obsess-vr.com/realtime3d/Armani_GlowRoom_v036.glb",(storeGlb) => {
                // loader.load("https://cdn.obsess-vr.com/realtime3d/Armani_GlowRoom_v026.glb",(storeGlb) => {
                    
                    storeGlb.scene.traverse((i)=>{
                        i.material && (i.material.envMapIntensity = ENV_MAP_INTENSITY );
                        // i.castShadow = true;
                    });

                    // i.receiveShadow = true;
                    try{
                        storeGlb.scene.getObjectByName(RELEVANT_STORE_PARTS_NAMES[0]).receiveShadow = true;
                    }
                    catch(e){
                        console.log(e);
                    }
                    
                    setUpNormalLights(scene);

                    roomObj = storeGlb.scene;
                    setRoom(storeGlb.scene);

                    if(storeGlb.animations && storeGlb.animations.length > 0){
                        handleAnimations(storeGlb);
                    }

                    // scene.add(storeGlb.scene);

                    toAddObjsRef.current.push(storeGlb.scene);

                    storeGlb.scene.scale.set(...STORE_SCALE)

                    window.store = storeGlb.scene;
                    resolve();
                })
            })
        }

        async function loadStoreAndModel() {

            // let FEM_MODEL_URL =   "https://cdn.obsess-vr.com/realtime3d/BaseFemaleAvatar_JPEG_DRACO_Ver10.glb";
            let FEM_MODEL_URL =   "https://cdn.obsess-vr.com/realtime3d/BaseFemaleAvatar_Ver11.glb";
            let M_MODEL_URL = "https://cdn.obsess-vr.com/realtime3d/BaseMaleAvatar_004_1.glb";

            let [_,maleModelMixerMap, femaleModelMixerMap] = await Promise.all([loadStore(), loadModelAndAnimations(M_MODEL_URL,maleLocalAvatarOutfitStringRef), loadModelAndAnimations(FEM_MODEL_URL,femaleLocalAvatarOutfitStringRef)]);

            let [maleModel, maleCharMixer, maleAnimationsMap ] = maleModelMixerMap;
            let [femaleModel, femaleCharMixer, femaleAnimationsMap ] = femaleModelMixerMap;


            window.maleModel = maleModel;
            window.femaleModel = femaleModel;

            
            setFemaleCharMixer(femaleCharMixer);
            setMaleCharMixer(maleCharMixer);
            
            setFemaleAnimationsMap(femaleAnimationsMap);
            setMaleAnimationsMap(maleAnimationsMap);
            
            // scene.add(maleModel);
            // scene.add(femaleModel);

            toAddObjsRef.current.push(maleModel);
            toAddObjsRef.current.push(femaleModel);

            maleModel.visible = false;
            
            setFAvatar(femaleModel);
            setMAvatar(maleModel);
            
            // setAvatar(maleModel);
            removeBottomBar();
        }

        loadStoreAndModel();
            
        return () => {
            window.characterControls.removeEvents();
            window.socket.disconnect();
            toAddObjsRef.current.forEach((i)=>{
                scene.remove(i);
            })

            toAddObjsRef.current = [];

            // scene.remove(roomObj)
            // scene.remove(model)

            resetRenderer(renderer);

        };
    }, [backgroundUrl]);


    return (
        <>
            {/* {adjustHotspots(scene)} */}
            {hideAllHotspots(scene)}
            {mAvatar && charControls && <AvatarCreatorContainer charControls={charControls} avatar={fAvatar} avatars={[mAvatar, fAvatar]} scene={scene} avatarPos={mAvatar.position} localAvatarNameRef={localAvatarNameRef}
                femaleLocalAvatarOutfitStringRef={femaleLocalAvatarOutfitStringRef}
                maleLocalAvatarOutfitStringRef={maleLocalAvatarOutfitStringRef}
                switchAvatar={switchAvatar}
                visibleGenderRef={visibleGenderRef}
            />}

            {mAvatar && <RealtimeControls scene={scene} camera={camera} renderer={renderer} femaleAvatar={fAvatar} maleAvatar={mAvatar} setCharControls={setCharControls} orbitControls={controller}
            toAddObjsRef={toAddObjsRef}
                charMixers={[maleCharMixer, femaleCharMixer]} animationsMaps={[maleAnimationsMap, femaleAnimationsMap]} storeMixer={storeMixer} charControls={charControls}
                localAvatarNameRef={localAvatarNameRef}
                femaleLocalAvatarOutfitStringRef={femaleLocalAvatarOutfitStringRef}
                maleLocalAvatarOutfitStringRef={maleLocalAvatarOutfitStringRef}
                visibleGenderRef={visibleGenderRef}
            />}
        </>
    );
};

export default RealtimeBackground;















