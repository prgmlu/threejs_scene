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

    folder.add(obj.scale, 'x').name('scale x').min(-10).max(10).step(0.001);
    folder.add(obj.scale, 'y').name('scale y').min(-10).max(10).step(0.001);
    folder.add(obj.scale, 'z').name('scale z').min(-10).max(10).step(0.001);

    folder.add(obj.position, 'x').name('position x').min(-10).max(10).step(0.001);
    folder.add(obj.position, 'y').name('position y').min(-10).max(10).step(0.001);
    folder.add(obj.position, 'z').name('position z').min(-10).max(10).step(0.001);
}