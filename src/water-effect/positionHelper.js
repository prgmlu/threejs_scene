import { GUI } from 'dat.gui';
export const createDatGui = function(obj, folderName){
    if (!window.DATGUI_DEFINED){
        var guiDiv = document.createElement('div');
        guiDiv.style.zIndex = 99;
        guiDiv.style.position = 'fixed';
        guiDiv.style.top = '0px';
        var bod = document.getElementsByTagName('body')[0];
        bod.appendChild(guiDiv);

        const gui = new GUI({autoPlace:false});
        window.gui = gui;
        // gui.close();
        // var cont = document.getElementById('datgui');
        guiDiv.appendChild(gui.domElement);
        window.DATGUI_DEFINED = true;

    }
    const folder = gui.addFolder(Math.random());

    // const folder1 = gui.addFolder('folder1');

    // folder1.add(obj.material.uniforms.lacunarity, 'value').name('lacunarity x').min(0).max(10).step(0.001);
    // folder1.add(obj.material.uniforms.gain, 'value').name('gain y').min(0).max(10).step(0.001);
    // folder1.add(obj.material.uniforms.magnitude, 'value').name('magnitude z').min(0).max(10).step(0.001);

    folder.add(obj.rotation, 'x').name('rotation x').min(-7).max(7).step(0.001);
    folder.add(obj.rotation, 'y').name('rotation y').min(-7).max(7).step(0.001);
    folder.add(obj.rotation, 'z').name('rotation z').min(-7).max(7).step(0.001);

    folder.add(obj.scale, 'x').name('scale x').min(-1000).max(1000).step(0.001);
    folder.add(obj.scale, 'y').name('scale y').min(-1000).max(1000).step(0.001);
    folder.add(obj.scale, 'z').name('scale z').min(-1000).max(1000).step(0.001);

    folder.add(obj.position, 'x').name('position x').min(-10).max(10).step(0.001);
    folder.add(obj.position, 'y').name('position y').min(-10).max(10).step(0.001);
    folder.add(obj.position, 'z').name('position z').min(-10).max(10).step(0.001);
}


export const setFaceTransforms = (face,planeMesh, units=9.99) => {
    switch (face) {
        case 'back':
            planeMesh.position.x = units;
            planeMesh.rotation.y = -Math.PI / 2;
            break;
        case 'front':
            planeMesh.position.x = -units;
            planeMesh.rotation.y = Math.PI / 2;
            break;
        case 'top':
            planeMesh.position.y = units;
            planeMesh.rotation.x = Math.PI / 2;
            break;
        case 'bottom':
            planeMesh.position.y = -units;
            planeMesh.rotation.x = -Math.PI / 2;
            break;
        case 'right':
            planeMesh.position.z = -units;
            break;
        case 'left':
            planeMesh.position.z = units;
            planeMesh.rotation.y = Math.PI;
            break;
    }
};


export const provideReadyPlanes  =  (imagesAndOpacitiesObj) => {
    let planes = {
        front: null,
        right: null,
        left: null,
        top: null,
        bottom: null,
        back: null,
    }
    if (imagesAndOpacitiesObj.front) {
        let plane = createPlane();
        setFaceTransforms('front', plane);
        planes.front = plane;
    }
    if (imagesAndOpacitiesObj.back) {
        let plane = createPlane();
        setFaceTransforms('back', plane);
        planes.back = plane;
    }
    if (imagesAndOpacitiesObj.top) {
        let plane = createPlane();
        setFaceTransforms('top', plane);
        planes.top = plane;
    }
    if (imagesAndOpacitiesObj.bottom) {
        let plane = createPlane();
        setFaceTransforms('bottom', plane);
        planes.bottom = plane;
    }
    if (imagesAndOpacitiesObj.right) {
        let plane = createPlane();
        setFaceTransforms('right', plane);
        planes.right = plane;
    }
    if (imagesAndOpacitiesObj.left) {
        let plane = createPlane();
        setFaceTransforms('left', plane);
        planes.left = plane;
    }
    return planes;
}