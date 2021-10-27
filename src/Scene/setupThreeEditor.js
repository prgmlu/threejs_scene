// import * as THREE from 'three';

export const setupRenderer = ( renderer, canvasContainer) => {
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(canvasContainer.offsetWidth,  canvasContainer.offsetHeight );
    renderer.setClearColor('black');
    canvasContainer.appendChild(renderer.domElement);
};

export const setupCamera = (aspectRatio, camera) => {
    const posX = 0.1;
    const rotY = (90 * Math.PI) / 180;

    camera.position.set(posX, 0, 0);
    camera.rotation.set(0, rotY, 0);
    camera.lookAt(0, 0, 0);
};
