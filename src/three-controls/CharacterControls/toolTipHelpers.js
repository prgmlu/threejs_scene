import {CSS2DRenderer,CSS2DObject} from './CSS2DRenderer';

export const initCSSRenderer = ()=> {
    let labelRenderer = new CSS2DRenderer();
    labelRenderer.domElement.style.pointerEvents = 'none';
    // labelRenderer.domElement.style.zIndex = "1";


    labelRenderer.setSize(window.innerWidth, window.innerHeight);
    labelRenderer.domElement.style.position = 'absolute';
    labelRenderer.domElement.style.top = '0px';
    document.body.appendChild(labelRenderer.domElement);

    return labelRenderer;
}

const styleTooltip = (tooltip)=>{
    tooltip.style.color = "white";
    tooltip.style.fontSize = "20px";
    tooltip.style.fontFamily = "sans-serif";
    tooltip.style.fontWeight = "bold";
    tooltip.style.position = "absolute";
    tooltip.style.borderRadius = "5px";
    // tooltip.style.opacity = "0.7";
    tooltip.style.pointerEvents = "none";
    tooltip.style.zIndex = "1";
    tooltip.style.width = "100px";
    tooltip.style.textAlign = "center";
}

export const addToolTipToModel = (obj, text) => {
    var tooltipDiv = document.createElement('div');
    tooltipDiv.className = 'label';
    tooltipDiv.textContent = text;

    styleTooltip(tooltipDiv);
    
    var tooltipTextMesh = new CSS2DObject(tooltipDiv);
    tooltipTextMesh.name = 'tooltip';

    tooltipTextMesh.position.set(0, 1.9, 0);
  
    obj.add(tooltipTextMesh);

    return {div: tooltipDiv, tooltipMesh: tooltipTextMesh};

  }
  
  export const updateToolTip = (obj, text) => {

  }