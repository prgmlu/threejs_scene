import { useEffect, useRef } from 'react';
import ThreeColliderSphere from './ThreeColliderSphere';

const ColliderSphere = ({scene}) => {
    const sphere = useRef();

    useEffect(() => {
        sphere.current = new ThreeColliderSphere();
        sphere.current.addToScene(scene);

        return () => {
            sphere.current.removeFromScene();
            sphere.current.dispose();
        };
    }, []); // eslint-disable-line

    return (
        null
    );
};

export default ColliderSphere;
