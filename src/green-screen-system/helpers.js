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
    const folder = gui.addFolder(folderName);
    folder.add(obj.material.uniforms.similarity, 'value').name('similarity').min(-3).max(4).step(0.001);
    folder.add(obj.material.uniforms.spill, 'value').name('spill').min(-3).max(4).step(0.001);
    folder.add(obj.material.uniforms.smoothness, 'value').name('smoothness').min(-3).max(4).step(0.001);

}
