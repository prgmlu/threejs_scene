import * as THREE from 'three';

const BLONDE_HAIR_TEXTURE = "https://cdn.obsess-vr.com/realtime3d/hair/Hair1Blonde_D.png";
const BROWN_HAIR_TEXTURE = "https://cdn.obsess-vr.com/realtime3d/hair/Hair1Brown_D.png";
const RED_HAIR_TEXTURE = "https://cdn.obsess-vr.com/realtime3d/hair/Hair1Red_D.png";

const BLUE_PANTS_TEXTURE = "https://cdn.obsess-vr.com/realtime3d/Pants2Blue_D.png";
const GREY_PANTS_TEXTURE = "https://cdn.obsess-vr.com/realtime3d/Pants2Grey_D.png";
const BLACK_PANTS_TEXTURE = "https://cdn.obsess-vr.com/realtime3d/Pants2Black_D.png";

const PINK_SHIRT_TEXTURE = "https://cdn.obsess-vr.com/realtime3d/Shirt2Pink_D.png";
const WHITE_SHIRT_TEXTURE = "https://cdn.obsess-vr.com/realtime3d/Shirt2White_D.png";
const BLACK_SHIRT_TEXTURE = "https://cdn.obsess-vr.com/realtime3d/Shirt2Black_D.png";

export const setMeshTextureImage  = (mesh, url) =>{
    let textureLoader = new THREE.ImageBitmapLoader();
    textureLoader.load(url, (imageBitmap) => {
        const texture = new THREE.CanvasTexture(imageBitmap);
        // mesh.material.map = texture;
        mesh.material.map.image = texture.image;
        mesh.material.map.needsUpdate = true
        mesh.material.needsUpdate = true
    });
}

export const getOutfitParts = (model, hide = false, hideHair=true) => {
    let hairs = [];
    let pants = [];
    let shirts = [];

    model.traverse((child) => {
        if (child.isMesh) {
            if (child.name.includes("Hair")) {
                hairs.push(child);
                if (hide && hideHair) {
                    child.visible = false;
                }
            }
            if (child.name.includes("Pants")) {
                pants.push(child);
                if (hide) {
                    child.visible = false;
                }
            }
            if (child.name.includes("Shirt")) {
                shirts.push(child);
                if (hide) {
                    child.visible = false;
                }
            }
        }
    });

    return {
        hairs,
        pants,
        shirts
    };
    
}

export const getOutfitStringFromModel = (model, hairColor, pantsColor, shirtColor)=> {
    let {
        hairs,
        pants,
        shirts
    } = getOutfitParts(model);

    let hairMesh = hairs.find(mesh => mesh.visible);
    let pantsMesh = pants.find(mesh => mesh.visible);
    let shirtMesh = shirts.find(mesh => mesh.visible);

    let outfitObj = {
        hairMesh: hairMesh.name,
        pantsMesh: pantsMesh.name,
        shirtMesh: shirtMesh.name,
        hairColor: hairColor,
        pantsColor: pantsColor,
        shirtColor: shirtColor
    };

    return JSON.stringify(outfitObj);
}



export const dressUpFromString = (model, outfitString) => {
    let outfit = JSON.parse(outfitString);
    // for example here it would be something like: 
    // {
    //   hairColor: "Red",
    //   hairMesh: "Hair1",
    //   pantsColor: "Blue",
    //   pantsMesh: "Pants2",
    //   shirtColor: "White",
    //   shirtMesh: "Shirt2",
    // }

    debugger;
    let {
        hairs,
        pants,
        shirts
    } = getOutfitParts(model, true, outfit.hairMesh? true : false);

    if(outfit.hairMesh){
    let hairMesh = hairs.find(mesh => mesh.name === outfit.hairMesh);
    hairMesh.visible = true;

    if (outfit.hairColor == 'Red') {
        window.hairColor = 'Red';
        setMeshTextureImage(hairMesh, RED_HAIR_TEXTURE);
    }
    if (outfit.hairColor == 'Brown') {
        window.hairColor = 'Brown';
        setMeshTextureImage(hairMesh, BROWN_HAIR_TEXTURE);
    }
    if (outfit.hairColor == 'Blonde') {
        window.hairColor = 'Blonde';
        setMeshTextureImage(hairMesh, BLONDE_HAIR_TEXTURE);
    }
}

    let pantsMesh = pants.find(mesh => mesh.name === outfit.pantsMesh);
    pantsMesh.visible = true;

    if (outfit.pantsColor == 'blue') {
        window.pantsColor = 'blue';
        setMeshTextureImage(pantsMesh, BLUE_PANTS_TEXTURE);
    }
    else if (outfit.pantsColor == 'grey') {
        window.pantsColor = 'grey';
        setMeshTextureImage(pantsMesh, GREY_PANTS_TEXTURE);
    }
    else if (outfit.pantsColor == 'black') {
        window.pantsColor = 'black';
        setMeshTextureImage(pantsMesh, BLACK_PANTS_TEXTURE);
    }
    else{
        window.pantsColor = null;
    }

    let shirtMesh = shirts.find(mesh => mesh.name === outfit.shirtMesh);
    shirtMesh.visible = true;


    if (outfit.shirtColor == 'pink') {
        window.shirtColor = 'pink';
        setMeshTextureImage(shirtMesh, PINK_SHIRT_TEXTURE);
    }
    else if (outfit.shirtColor == 'white') {
        window.shirtColor = 'white';
        setMeshTextureImage(shirtMesh, WHITE_SHIRT_TEXTURE);
    }
    else if (outfit.shirtColor == 'black') {
        window.shirtColor = 'black';
        setMeshTextureImage(shirtMesh, BLACK_SHIRT_TEXTURE);
    }
    else{
        window.shirtColor = null;
    }
}



window.setMeshTextureImage = setMeshTextureImage;
window.getOutfitParts = getOutfitParts;
window.getOutfitStringFromModel = getOutfitStringFromModel;
window.dressUpFromString = dressUpFromString;