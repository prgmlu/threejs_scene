import React, { useEffect, useState, useRef } from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import {resetRenderer, setUpEnvMap, loadModelAndAnimations, setUpNormalLights, setUpSceneBackground, hideAllExceptFirstClothItem} from '../threeHelpers';

import AvatarCreatorContainer from './AvatarCreatorContainer';
import RealtimeControls from './RealtimeControls';
import './output.css';
import { femalePredeterminedOutfitsWithHair,malePredeterminedOutfitsWithHair } from './avatar-creator/predeterminedOutfits';
import { RELEVANT_STORE_PARTS_NAMES } from './avatar-creator/CustomizationConstants';

import { adjustHotspots } from './demoHelpers';

import { adjustRenderer } from '../threeHelpers';

//import draco loader
import { DRACOLoader } from './DRACOLoader.js';
import * as THREE from 'three';

// a function that makes a timer that resets on mouse events




	
let createCanvasContext = (canvas) => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    return canvas.getContext('2d');
}


let createEffectCanvas = () => {
    let effectCanvas = document.createElement('canvas');
    window.effectCanvas = effectCanvas;
    const root = document.getElementById("canvas-wrapper");
    effectCanvas.style.zIndex = 10;
    effectCanvas.style.position = 'absolute';
    effectCanvas.style.top = 0;
    effectCanvas.style.left = 0;
    effectCanvas.style.pointerEvents = 'none';
    window.effectCanvasContext = createCanvasContext(effectCanvas);
    effectCanvas.id =  'effectCanvas';
    root.appendChild(effectCanvas);
}



let setupRaycaster = (camera, objs) => {

    let raycaster = new THREE.Raycaster();
    window.addEventListener('click', (e) => {
        var x = (e.touches && e.touches.length > 0) ? e.touches[0].clientX : e.clientX
        var y = (e.touches && e.touches.length > 0) ? e.touches[0].clientY : e.clientY
        raycaster.setFromCamera({ x: (x / window.innerWidth) * 2 - 1, y: -(y / window.innerHeight) * 2 + 1 }, camera)

        var hit = raycaster.intersectObjects(objs)

        if (!hit.length)
        return

        var obj = hit[0].object

    })

}


const STORE_Y_OFFSET = 7;



let hideAllHotspots = (scene) => {

    scene.children.filter((i)=>{return i.name=='marker' || i.name=='visualObject'}).forEach((i)=>{i.visible=false;});
}


let getDistanceOfHotspots = (hotspotPositions, femaleModel, hotspots) => {
    if(!hotspotPositions || !femaleModel || !hotspots){return}

    requestAnimationFrame(()=>getDistanceOfHotspots(hotspotPositions, window.femaleModel, hotspots));

    // find the distance between the femaleModel and the hotspot on the xz plane

    let modelPositionOnXZPlane = new THREE.Vector3(window.femaleModel.position.x, 0, window.femaleModel.position.z);

    let hotspotPositionsOnXZPlane = hotspotPositions.map((hotspotPosition) => {
        return new THREE.Vector3(hotspotPosition.x, 0, hotspotPosition.z);
    });

    let distances = hotspotPositionsOnXZPlane.map((hotspotPositionOnXZPlane) => {
        return modelPositionOnXZPlane.distanceTo(hotspotPositionOnXZPlane);
    });


    // hide the hotsptos if the distance is greater than 11
    hotspots.forEach((hotspot, index) => {
        if(distances[index] > 20){
            hotspot.visible = false;
        }else{
            hotspot.visible = true;
        }
    }
    );
}

let placeHotspots = () => {

}

let adjustHotspotsToY0 = () => {
    scene.children.filter((i)=>['marker','visualObject'].includes(i.name)).forEach((i)=>{i.position.y=2;});
}

let adjustHostpotsToDepthTestTrue = () => {
    scene.children.filter((i)=>['visualObject'].includes(i.name)).forEach((i)=>{i.material.depthTest=true;});

}

let getHotspotBoxPairs = () => {
    let pairs = [];
    let hotspotsAndBoxes = scene.children.filter((i)=>['marker','visualObject'].includes(i.name))

    //group them in twos and push into pairs
    for(let i = 0; i < hotspotsAndBoxes.length; i+=2){
        pairs.push([hotspotsAndBoxes[i], hotspotsAndBoxes[i+1]]);
    }
    return pairs;
}

let placePairsGivenPoints = (pairs, points) => {

    if(!pairs || !points || pairs.length==0 || points.length==0){return;}
    //slice pairs and points to be the same size
    let pairsToUse = pairs.slice(0, points.length);
    // pairsToUse.push(pairs[pairs.length-2]);
    pairsToUse[0] = pairs[pairs.length-1];
    pairsToUse[1] = pairs[pairs.length-2];

    window.pairsToUse = pairsToUse;
    // pairs not to use are the ones not in pairsToUse
    let pairsNotToUse = pairs.filter((pair) => {
        return !pairsToUse.includes(pair);
    });


    pairsToUse.forEach((pair, index) => {
        let hotspot;
        let box;
        try{
            hotspot = pair[0];
            box = pair[1];

        }
        catch{
        }

        hotspot.position.x = points[index].x;
        hotspot.position.z = points[index].z;

        box.position.x = points[index].x;
        box.position.z = points[index].z;
    });

    // hide the pairs not to use
    pairsNotToUse.forEach((pair) => {
        let hotspot = pair[0];
        let box = pair[1];
        hotspot.visible = false;
        box.visible = false;
    });
}


let adjustPairsGivenHardcodedData = () =>{
    let pairs = getHotspotBoxPairs();
    window.pairs = pairs;
    let pts = [
        {
            "x": -0.7709604647441286,
            "y": 0.6431190815503904,
            "z": 1.5737349485613856 + .5
        },
        {
            "x": 6.986763513238895,
            "y": 1.818305150993834,
            "z": 2.3861376638873866 + .5
        },
        {
            "x": 4.765384344674514,
            "y": 0.1887653750940484,
            "z": -1.7555395049756977 + .5
        },
        {
            "x": 4.765384344674514,
            "y": 0.1887653750940484,
            "z": -1.7555395049756977 + .5
        },
        {
            "x": -4.511625460181749,
            "y": 1.070805716273338,
            "z": -12.560001780689092 + .5
        },
        {
            "x": -5.285417533613236,
            "y": 1.5255792933159809,
            "z": -12.40626351730901 + .5
        },
        {
            "x": 4.556162706515843,
            "y": 1.8017809282434347,
            "z": -30.209145999185953 + .5
        },
        {
            "x": 3.9077987962357703,
            "y": 1.751233883701674,
            "z": -30.271256723009724 + .5
        },
        {
            "x": 3.2391950090350656,
            "y": 1.7716668965628362,
            "z": -30.433689088933694 + .5
        },
        {
            "x": 2.3702360479038873,
            "y": 1.7424325267726637,
            "z": -31.637132523110257 + .5
        }
    ]
    placePairsGivenPoints(pairs, pts);
}


let removeBottomBar = ()=>{setInterval(()=>{try{document.querySelectorAll('.bottombar-container')[0].remove()}catch{null;}},1000);};

let ENV_MAP_INTENSITY = 2;
let STORE_SCALE = [80,80,80];

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


const createVidDom = function(src){
    var video = document.createElement('video');
    video.src = src;
    video.setAttribute('webkit-playsinline', '');
    video.crossOrigin = 'anonymous';
    video.setAttribute('playsinline', '');
    video.setAttribute('loop', 'loop');
    video.setAttribute('autoplay', 'autoplay');
    video.muted = true;
    video.play();
    // video.currentTime = 1;
    // video.playsInline = true;
    return video;
}

export const createVidScreen = function (vid_source, pos, scale, rot, alphaMapImg, onTop){
    const video = createVidDom(vid_source);
    // videos.push(video);
    const videoTexture = new THREE.VideoTexture(video);
    videoTexture.minFilter = THREE.LinearFilter;
    videoTexture.magFilter = THREE.LinearFilter;

    const loader = new THREE.TextureLoader();
    loader.crossOrigin = '';


    var materialParams = {
        transparent : true,
        depthTest: false,
        opacity : 1,
        toneMapped : false,
        map : videoTexture,
        side : THREE.DoubleSide,
    };

    if (onTop){
        materialParams.depthWrite = false;
        materialParams.depthTest = false;
    }

    if (alphaMapImg){
        var alphaMapTexture = loader.load(alphaMapImg);
        materialParams.alphaMap = alphaMapTexture;
    }

    var videoMaterial =  new THREE.MeshBasicMaterial( {...materialParams} );

    const screen = new THREE.PlaneGeometry(10, 10);
    const videoScreen = new THREE.Mesh(screen, videoMaterial);

    videoScreen.position.set(pos.x, pos.y, pos.z);
    videoScreen.rotation.set(rot.x,rot.y,rot.z)
    videoScreen.scale.set(scale.x, scale.y, scale.z);

    return videoScreen;
    }

const RealtimeBackground = ({ scene, renderer,camera, backgroundUrl, controller }) => {
    
    // setUpSceneBackground (scene, true);

    if(!window.vid){

        createEffectCanvas();
        var canvas = document.getElementById("effectCanvas");
        var ctx = window.effectCanvasContext;
        // ctx.fillStyle = "blue";
        // ctx.fillRect(0, 0, canvas.width, canvas.height);

        var video = createVidDom("https://cdn.obsess-vr.com/charlotte-tilbury/pillow-talk-party/PT_PARTY_VS_WORMHOLE_LANDSCAPE.mp4");


        video.addEventListener("play", () => {
            function step() {
            console.log('setp')
              ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

              window.vidId = requestAnimationFrame(step);

            }
            step();
          });
        
        window.vid = true;
    }


    let toAddObjsRef = useRef([]);

    let stopAvatarAnimationLoopRef = useRef(()=>{});

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

    // const localAvatarNameRef = useRef(createRandomName());
    const localAvatarNameRef = useRef('');
    window.localAvatarNameRef = localAvatarNameRef;

    const visibleGenderRef = useRef("female");
    window.visibleGenderRef  = visibleGenderRef;

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
            // action.loop = THREE.LoopPingPong;
            action.loop = THREE.LoopRepeat;
            action.play();
        })
        setStoreMixer(newStoreMixer);
    }

    useEffect(() => {
        const script = document.createElement('script');
      
        script.src = "https://cdn.obsess-vr.com/realtime3d/pleaserotate.js";
        script.async = true;
      
        document.body.appendChild(script);
      
        return () => {
          document.body.removeChild(script);
        }
      }, []);


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
                loader.load("https://cdn.obsess-vr.com/realtime3d/CT_Holiday2022_v031.glb",(storeGlb) => {
                // loader.load("https://cdn.obsess-vr.com/realtime3d/Armani_GlowRoom_v026.glb",(storeGlb) => {
                // loader.load("https://cdn.obsess-vr.com/realtime3d/CharlotteTilbury_sceneAnim_v030.glb",(storeGlb) => {
                // loader.load("https://cdn.obsess-vr.com/realtime3d/Armani_GlowRoom_v036.glb",(storeGlb) => {
                // loader.load("https://cdn.obsess-vr.com/realtime3d/Armani_GlowRoom_v026.glb",(storeGlb) => {
                    
                    storeGlb.scene.traverse((i)=>{
                        i.material && (i.material.envMapIntensity = ENV_MAP_INTENSITY );
                        // i.castShadow = true;
                    });

                    let allObjs = [];
                    storeGlb.scene.traverse((i)=>{
                        allObjs.push(i);
                    });
                    // setupRaycaster(camera, [...allObjs]);

                    // i.receiveShadow = true;
                    try{
                        // storeGlb.scene.getObjectByName(RELEVANT_STORE_PARTS_NAMES[0]).receiveShadow = true;
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
            console.log('loading store')

            // let FEM_MODEL_URL =   "https://cdn.obsess-vr.com/realtime3d/BaseFemaleAvatar_JPEG_DRACO_Ver10.glb";
            let FEM_MODEL_URL =   "https://cdn.obsess-vr.com/realtime3d/BaseFemaleAvatar_Ver15.glb";
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
            window.labelRenderer && window.labelRenderer.domElement.remove();
            

            // that.stopAnimationFrame();
            stopAvatarAnimationLoopRef.current();

            window.characterControls && window.characterControls.removeEvents();
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
        {/* {inactivityTime()} */}
        {/* {setupRaycaster(camera,scene.children.filter((i)=>i.name=='marker'))} */}
            {adjustHotspotsToY0(scene)}
{        adjustHostpotsToDepthTestTrue()}

{adjustPairsGivenHardcodedData()}
            {/* {hideAllHotspots(scene)} */}


            {mAvatar && charControls && <AvatarCreatorContainer charControls={charControls} avatar={fAvatar} avatars={[mAvatar, fAvatar]} scene={scene} avatarPos={mAvatar.position} localAvatarNameRef={localAvatarNameRef}
                femaleLocalAvatarOutfitStringRef={femaleLocalAvatarOutfitStringRef}
                maleLocalAvatarOutfitStringRef={maleLocalAvatarOutfitStringRef}
                switchAvatar={switchAvatar}
                visibleGenderRef={visibleGenderRef}
            />}

            {mAvatar && <RealtimeControls stopAvatarAnimationLoopRef={stopAvatarAnimationLoopRef} scene={scene} camera={camera} renderer={renderer} femaleAvatar={fAvatar} maleAvatar={mAvatar} setCharControls={setCharControls} orbitControls={controller}
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















