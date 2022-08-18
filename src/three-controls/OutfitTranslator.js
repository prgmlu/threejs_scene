import * as THREE from 'three';

// import {BLONDE_HAIR_TEXTURES, BROWN_HAIR_TEXTURES, RED_HAIR_TEXTURES} from '../three-background/realtimeBackground/avatar-creator/avatarsData';
import {BLONDE_HAIR_TEXTURES, BROWN_HAIR_TEXTURES, RED_HAIR_TEXTURES} from './avData';
import { USE_OLD_CHARACTER_MODEL } from '../three-background/RealtimeBackground/avatar-creator/CustomizationConstants';

const BLUE_PANTS_TEXTURE = "https://cdn.obsess-vr.com/realtime3d/Pants2Blue_D.png";
const GREY_PANTS_TEXTURE = "https://cdn.obsess-vr.com/realtime3d/Pants2Grey_D.png";
const BLACK_PANTS_TEXTURE = "https://cdn.obsess-vr.com/realtime3d/Pants2Black_D.png";

const PINK_SHIRT_TEXTURE = "https://cdn.obsess-vr.com/realtime3d/Shirt2Pink_D.png";
const WHITE_SHIRT_TEXTURE = "https://cdn.obsess-vr.com/realtime3d/Shirt2White_D.png";
const BLACK_SHIRT_TEXTURE = "https://cdn.obsess-vr.com/realtime3d/Shirt2Black_D.png";

export const setMeshTextureImage  = (mesh, url) =>{
    let textureLoader = new THREE.ImageBitmapLoader();
    textureLoader.load(url, (imageBitmap) => {
        // const texture = new THREE.CanvasTexture(imageBitmap);
        // mesh.material.map = texture;
        mesh.material.map.image = imageBitmap;

        mesh.material.map.needsUpdate = true
        mesh.material.needsUpdate = true
    });
}

export const getOutfitParts = (model, hide = false, hideHair=true) => {
    let hairs = [];
    let pants = [];
    let shirts = [];
    let shoes = [];
    let glasses = [];

    model.traverse((child) => {
            if (child.name.toLowerCase().includes("hair")) {
                hairs.push(child);
                if (hide && hideHair) {
                    child.visible = false;
                }
            }
            if (child.name.toLowerCase().includes("pants")) {
                pants.push(child);
                if (hide) {
                    child.visible = false;
                }
            }
            if (child.name.toLowerCase().includes("shirt")) {
                shirts.push(child);
                if (hide) {
                    child.visible = false;
                }
            }
            if (child.name.toLowerCase().includes("shoes")) {
                shoes.push(child);
                if (hide) {
                    child.visible = false;
                }
            }
            if (child.name.toLowerCase().includes("glasses")) {
                glasses.push(child);
                if (hide) {
                    child.visible = false;
                }
            }
    });

    return {
        hairs,
        pants,
        shirts,
        shoes,
        glasses
    };
    
}

export const getOutfitStringFromModel = (model, hairColor, pantsColor, shirtColor)=> {
    let {
        hairs,
        pants,
        shirts,
        shoes,
        glasses
    } = getOutfitParts(model);

    let hairMesh = hairs.find(mesh => mesh.visible);
    let pantsMesh = pants.find(mesh => mesh.visible);
    let shirtMesh = shirts.find(mesh => mesh.visible);
    let shoesMesh = shoes.find(mesh => mesh.visible);
    let glassesMesh = glasses.find(mesh => mesh.visible);

    let outfitObj = {
        hairMesh: hairMesh.name,
        pantsMesh: pantsMesh.name,
        glassesMesh: glassesMesh.name,
        shirtMesh: shirtMesh.name,
        shoesMesh: shoesMesh? shoesMesh.name :null,
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

    let {
        hairs,
        pants,
        shirts,
        shoes,
        glasses
    } = getOutfitParts(model, true, (outfit.hairMesh)? true : false);

        if(outfit.hairMesh){
        
        let hairMesh = hairs.find(mesh => mesh.name === outfit.hairMesh);
        // if(!hairMesh){
        //     debugger;
        // }
        hairMesh.visible = true;

        if(USE_OLD_CHARACTER_MODEL){
            let meshNumber = 1;
            if(outfit.hairMesh.includes("2")){
                meshNumber = 2;
            }
            if(outfit.hairMesh.includes("3")){
                meshNumber = 3;
            }
    
            if (outfit.hairColor == 'Red') {
                setMeshTextureImage(hairMesh, RED_HAIR_TEXTURES[meshNumber - 1]);
            }
            if (outfit.hairColor == 'Brown') {
                setMeshTextureImage(hairMesh, BROWN_HAIR_TEXTURES[meshNumber - 1]);
            }
            if (outfit.hairColor == 'Blonde') {
                setMeshTextureImage(hairMesh,   BLONDE_HAIR_TEXTURES[meshNumber - 1]);
            }
        }
        else{
            let meshNumber = 1;
            if(outfit.hairMesh.includes("3")){
                meshNumber = 2;
            }
            if(outfit.hairMesh.includes("4")){
                meshNumber = 3;
            }
    
            if (outfit.hairColor == 'Red') {
                setMeshTextureImage(hairMesh, RED_HAIR_TEXTURES[meshNumber - 1]);
            }
            if (outfit.hairColor == 'Brown') {
                setMeshTextureImage(hairMesh, BROWN_HAIR_TEXTURES[meshNumber - 1]);
            }
            if (outfit.hairColor == 'Blonde') {
                setMeshTextureImage(hairMesh,   BLONDE_HAIR_TEXTURES[meshNumber - 1]);
            }

        }
    }

    let shoesMesh = shoes.find(mesh => mesh.name === outfit.shoesMesh);
    if(shoesMesh)
        shoesMesh.visible = true;

    let glassesMesh = glasses.find(mesh => mesh.name === outfit.glassesMesh);
    if(glassesMesh)
        glassesMesh.visible = true;

    let pantsMesh = pants.find(mesh => mesh.name === outfit.pantsMesh);
    pantsMesh.visible = true;

    if (outfit.pantsColor == 'blue') {
        setMeshTextureImage(pantsMesh, BLUE_PANTS_TEXTURE);
    }
    else if (outfit.pantsColor == 'grey') {
        setMeshTextureImage(pantsMesh, GREY_PANTS_TEXTURE);
    }
    else if (outfit.pantsColor == 'black') {
        setMeshTextureImage(pantsMesh, BLACK_PANTS_TEXTURE);
    }

    let shirtMesh = shirts.find(mesh => mesh.name === outfit.shirtMesh);
    shirtMesh.visible = true;


    if (outfit.shirtColor == 'pink') {
        setMeshTextureImage(shirtMesh, PINK_SHIRT_TEXTURE);
    }
    else if (outfit.shirtColor == 'white') {
        setMeshTextureImage(shirtMesh, WHITE_SHIRT_TEXTURE);
    }
    else if (outfit.shirtColor == 'black') {
        setMeshTextureImage(shirtMesh, BLACK_SHIRT_TEXTURE);
    }
}


window.setMeshTextureImage = setMeshTextureImage;
window.getOutfitParts = getOutfitParts;
window.getOutfitStringFromModel = getOutfitStringFromModel;
window.dressUpFromString = dressUpFromString;