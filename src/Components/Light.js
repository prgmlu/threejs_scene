import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';


//TODO: dispose

class LightInstance {
    constructor(type, config = {}) {
        if (type === 'ambient') this.instance = new THREE.AmbientLight(config.color || 0xffffff, config.intensity || 1);
        else if (type === 'directional') this.instance = new THREE.DirectionalLight(config.color || 0xffffff, config.intensity || 1);

        if (this.instance) {
            this.instance.name = `${type}-light`;
            this.instance.userData.config = config;
        }
    }

}


export default function LightComponent  ({ type, config = {}, scene })  {
    const lightRef = useRef();

    const isPropsEqual = (obj1, obj2) => (JSON.stringify(obj1) == JSON.stringify(obj2));


    useEffect(() => () => {
        removeFromScene();
        console.log(`%c UNMOUNT LIGHT ${type}`, 'color:red', scene);
    }, []);


    const removeFromScene = () => {
        scene.remove(lightRef.current);
        lightRef.current = null;
        console.log(`%c REMOVE LIGHT ${type}`, 'color:red', scene);
    };


    console.log(' LIGHT', type, { scene });

    useEffect(() => {
        if (config.enabled) {

            //NEW
            if (!lightRef.current) {
                lightRef.current = new LightInstance(type, config).instance;
                scene.add(lightRef.current);
            }
            //UPDATE in config
            if (lightRef.current && !isPropsEqual(config, lightRef.current.userData.config)) {
                // console.log('%c LIGHT update', 'color:green', { type, scene, lightRef, config });


                if (config.color) lightRef.current.color = new THREE.Color(config.color);
                if (config?.intensity >= 0) lightRef.current.intensity = config.intensity;
                lightRef.current.userData.config = config;//update config
            }

            console.log('%c LIGHT eff', 'color:green', { type, scene, lightRef, config });
        }
        //was DISABLED
        else if (!config.enabled && lightRef.current) {
            removeFromScene();
        }


    }, [config]);


    return false;
};