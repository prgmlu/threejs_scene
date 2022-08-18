import JoystickControls from "../../three-controls/JoystickControls"
import React, { useEffect, useState, useRef } from 'react';
import ThreeController from '../../three-controls/ThreeController';

export default function RealtimeControls(props) {
    let { scene, camera, renderer, avatar, charMixer, animationsMap, storeMixer, setCharControls,orbitControls, localAvatarNameRef,localAvatarOutfitStringRef } = props;
    let [joystickBroadcast, setJoystickBroadcast] = useState(null);
    let controlsLoaded = useRef(false);
    let directionValues = useRef([0,0,0,0])
    
    useEffect(() => {
        let u = ThreeController.setupCharacterControls(avatar, charMixer, animationsMap, storeMixer, directionValues.current,localAvatarNameRef,localAvatarOutfitStringRef, scene,camera);
        setCharControls(u);
        u.setUpCollisionDetection();
        controlsLoaded.current = true;
    } ,[])

    return (
        <>
        {controlsLoaded.current &&  <JoystickControls directionValues={directionValues.current}
         scene={scene} camera={camera} renderer={renderer} avatar={avatar} orbitControls={orbitControls} />}
        </>
    )
}
