import {
    CSS2DRenderer,
    CSS2DObject
  } from 'three/examples/jsm/renderers/CSS2DRenderer';

export const initCSSRenderer = ()=> {
    let labelRenderer = new CSS2DRenderer();
    labelRenderer.domElement.style.pointerEvents = 'none';


    window.labelRenderer = labelRenderer;
    labelRenderer.setSize(window.innerWidth, window.innerHeight);
    labelRenderer.domElement.style.position = 'absolute';
    labelRenderer.domElement.style.top = '0px';
    document.body.appendChild(labelRenderer.domElement);
}

export const addToolTipToModel = (obj, text) => {
    var cubeDiv = document.createElement('div');
    cubeDiv.className = 'label';
  
    cubeDiv.textContent = text;
    cubeDiv.style.color = "white";
    cubeDiv.style.fontSize = "20px";
    cubeDiv.style.fontFamily = "sans-serif";
    cubeDiv.style.fontWeight = "bold";
    cubeDiv.style.position = "absolute";
    cubeDiv.style.borderRadius = "5px";
    // cubeDiv.style.opacity = "0.7";
    cubeDiv.style.pointerEvents = "none";
    cubeDiv.style.zIndex = "1";
    cubeDiv.style.width = "100px";
    cubeDiv.style.textAlign = "center";
    
    
    var cubeLabel = new CSS2DObject(cubeDiv);
    cubeLabel.position.set(0, 1.9, 0);
    window.cubeLabel = cubeLabel;
    debugger;
  
    obj.add(cubeLabel);

  }
  