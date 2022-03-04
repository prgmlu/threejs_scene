import * as THREE from 'three';
import React , { useEffect, useRef } from 'react';

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
    return video;
}

export const createVidScreen = function (vid_source, position, scale, rotation){
    const video = createVidDom(vid_source);
    const videoTexture = new THREE.VideoTexture(video);
    videoTexture.minFilter = THREE.LinearFilter;
    videoTexture.magFilter = THREE.LinearFilter;

    const loader = new THREE.TextureLoader();
    loader.crossOrigin = '';


    var materialParams = {
        transparent : true,
        opacity : 1,
        toneMapped : false,
        map : videoTexture
    };

    var videoMaterial =  new THREE.MeshBasicMaterial( {...materialParams} );

    const screen = new THREE.PlaneGeometry(1, 1);
    const videoScreen = new THREE.Mesh(screen, videoMaterial);

    videoScreen.position.set(position.x, position.y, position.z);
    videoScreen.rotation.set(rotation.x,rotation.y,rotation.z)
    videoScreen.scale.set(scale.x, scale.y, scale.z);

    return videoScreen;
    }


    export const InSceneVidComponent = (props) =>{
        let {src, position, scale, rotation, scene, sceneRef} = props;
        scene = sceneRef?.current || scene;
        var vidScreen = useRef(null);
        useEffect(() => {
                vidScreen.current = createVidScreen(src, position, scale, rotation);
                scene.add(vidScreen.current);
                return ()=>{
                    scene.remove(vidScreen.current);
                }
        }, [scene])

        return (
            <div></div>
        )
    }