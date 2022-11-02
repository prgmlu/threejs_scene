import JoystickControls from "../../three-controls/CharacterControls/JoystickControls"
import React, { useEffect, useState, useRef } from 'react';
import ThreeController from '../../three-controls/ThreeController';



export default function RealtimeControls(props) {
    console.log('RealtimeControls constructor');
    let { scene, camera, renderer, maleAvatar, femaleAvatar, charMixers, animationsMaps, storeMixer, setCharControls,orbitControls, localAvatarNameRef,femaleLocalAvatarOutfitStringRef, maleLocalAvatarOutfitStringRef, visibleGenderRef, toAddObjsRef,stopAvatarAnimationLoopRef } = props;
    let [joystickBroadcast, setJoystickBroadcast] = useState(null);
    let controlsLoaded = useRef(false);
    let directionValues = useRef([0,0,0,0])
    
    useEffect(() => {
        console.log('RealtimeControls useEffect');
        let u = ThreeController.setupCharacterControls([maleAvatar,femaleAvatar], charMixers, animationsMaps, storeMixer, directionValues.current,localAvatarNameRef,femaleLocalAvatarOutfitStringRef, maleLocalAvatarOutfitStringRef,visibleGenderRef,toAddObjsRef,stopAvatarAnimationLoopRef, scene,camera);
        setCharControls(u);
        controlsLoaded.current = true;
    } ,[])

    return (
        <>
        {controlsLoaded.current &&  <JoystickControls directionValues={directionValues.current}
         scene={scene} camera={camera} renderer={renderer} orbitControls={orbitControls} />}
        </>
    )
}
