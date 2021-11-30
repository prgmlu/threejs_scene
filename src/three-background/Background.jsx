import React, { useState, useEffect } from 'react';
import BackgroundCube from './BackgroundCube';
import FlatBackground from './FlatBackground';

const Background = ({ scene, bgConf, resetBGBeforeImageLoaded }) => {
    const [backgroundUrl, setBackgroundUrl] = useState('');
    const [isFlatScene, setFlatScene] = useState(false);
    console.log('%c >INIT: - Background', 'color:green', bgConf);

    useEffect(() => {
        if(bgConf){
            setFlatScene(bgConf.isFlatScene);
            setBackgroundUrl(bgConf.backgroundUrl);
        }
    }, [bgConf]);

    return (
        isFlatScene
            ? <FlatBackground backgroundUrl={backgroundUrl} scene={scene} resetBGBeforeImageLoaded={resetBGBeforeImageLoaded}/>
            : <BackgroundCube backgroundUrl={backgroundUrl} scene={scene}/>
    );
};

export default Background;
