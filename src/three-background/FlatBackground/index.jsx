import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import ThreeFlatBackground from './ThreeFlatBackground';
import  {formatDate} from "../../utils";

const FlatBackground = ({ scene, backgroundUrl, resetBeforeImageLoaded }) => {
    const flatBackground = useRef();

    useEffect(() => {
        flatBackground.current = new ThreeFlatBackground();
        if(scene) flatBackground.current.addToScene(scene);
        window.addEventListener('resize', flatBackground.current.setPanArea);

        return () => {
            flatBackground.current.dispose();
            window.removeEventListener('resize', flatBackground.current.setPanArea);
        };
    }, []);

    useEffect(() => {
        console.log('___FlatBG:image changed', {
            flatBackground: flatBackground.current,
            resetBeforeImageLoaded
        });
        if(resetBeforeImageLoaded){
            flatBackground.current.resetMaterial();
        }
        if (backgroundUrl) {
            flatBackground.current.loadTexture(`${backgroundUrl}?v=${formatDate(new Date(), "mmddyyyyhh")}`);
        }
    }, [backgroundUrl]);

    return null;
};

FlatBackground.propTypes = {
    backgroundUrl: PropTypes.string.isRequired,
};

export default FlatBackground;
