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

const eyeMeshNames = [

    'Eye',
    'Eye2',
    'Eye3',
    'Eye4',


]

const avatarSkinNames = [

    "FemaleAvatar_Body",
    "FemaleAvatar_Body4",

]

export const getOutfitParts = (model, hide = false, hideHair=true) => {
    let hairs = [];
    let pants = [];
    let shirts = [];
    let shoes = [];
    let glasses = [];
    let noses = [];
    let mouthLips = [];
    let eyeBrows = [];
    let eyeLashes = [];
    let eyeLids = [];
    let eyes = [];
    let skirts = [];
    let dresses = [];

    let avatarSkins = []
    
    

    model.traverse((child) => {
            if (child.name.toLowerCase().includes("hair")) {
                hairs.push(child);
                if (hide && hideHair) {
                    child.visible = false;
                }
            }
            if(child.name.toLowerCase().includes("dress")){
                dresses.push(child);
                if(hide){
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
            if (child.name.toLowerCase().includes("nose")) {
                noses.push(child);
                if (hide) {
                    child.visible = false;
                }
            }
            if (child.name.toLowerCase().includes("mouth")) {
                mouthLips.push(child);
                if (hide) {
                    child.visible = false;
                }
            }
            if (child.name.toLowerCase().includes("eyebrow")) {
                eyeBrows.push(child);
                if (hide) {
                    child.visible = false;
                }
            }
            if (child.name.toLowerCase().includes("eyelash")) {
                eyeLashes.push(child);
                if (hide) {
                    child.visible = false;
                }
            }
            if (child.name.toLowerCase().includes("eyelid")) {
                eyeLids.push(child);
                if (hide) {
                    child.visible = false;
                }
            }
            if (eyeMeshNames.includes(child.name)) {
                eyes.push(child);
                if (hide) {
                    child.visible = false;
                }
            }
            if (child.name.toLowerCase().includes("skirt")) {
                skirts.push(child);
                if (hide) {
                    child.visible = false;
                }
            }

            if (avatarSkinNames.includes(child.name)) {
                avatarSkins.push(child);
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
        glasses,
        noses,
        mouthLips,
        eyeBrows,
        eyeLashes,
        eyeLids,
        eyes,
        skirts,
        avatarSkins,
        dresses

    };
    
}

export const getOutfitStringFromModel = (model, hairColor, pantsColor, shirtColor)=> {
    let {
        hairs,
        pants,
        shirts,
        shoes,
        glasses,
        noses,
        mouthLips,
        eyeBrows,
        eyeLashes,
        eyeLids,
        eyes,
        skirts,
        avatarSkins,
        dresses
    } = getOutfitParts(model);

    let hairMesh = hairs.find(mesh => mesh.visible);
    let pantsMesh = pants.find(mesh => mesh.visible);
    let shirtMesh = shirts.find(mesh => mesh.visible);
    let shoesMesh = shoes.find(mesh => mesh.visible);
    let glassesMesh = glasses.find(mesh => mesh.visible);
    let noseMesh = noses.find(mesh => mesh.visible);
    let mouthLipsMesh = mouthLips.find(mesh => mesh.visible);
    let eyeBrowsMesh = eyeBrows.find(mesh => mesh.visible);
    let eyeLashesMesh = eyeLashes.find(mesh => mesh.visible);
    let eyeLidsMesh = eyeLids.find(mesh => mesh.visible);
    let eyeMesh = eyes.find(mesh => mesh.visible);
    let skirtMesh = skirts.find(mesh => mesh.visible);
    let avatarSkinMesh = avatarSkins.find(mesh => mesh.visible);

    let dressMesh = dresses.find(mesh => mesh.visible);

    let outfitObj = {
        hairMesh: hairMesh.name,
        pantsMesh: pantsMesh.name,
        glassesMesh: glassesMesh.name,
        shirtMesh: shirtMesh.name,
        shoesMesh: shoesMesh? shoesMesh.name :null,
        mouthLipsMesh: mouthLipsMesh,
        eyeBrowsMesh: eyeBrowsMesh,
        eyeLashesMesh: eyeLashesMesh,
        eyeLidsMesh: eyeLidsMesh,
        eyeMesh: eyeMesh,
        skirtMesh: skirtMesh,
        noseMesh: noseMesh,
        hairColor: hairColor,
        pantsColor: pantsColor,
        shirtColor: shirtColor,
        avatarSkinMesh: avatarSkinMesh,
        dressMesh: dressMesh

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
        glasses,
        noses,
        mouthLips,
        eyeBrows,
        eyeLashes,
        eyeLids,
        eyes,
        skirts,
        avatarSkins,
        dresses
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

    let dressMesh = dresses.find(mesh => mesh.name === outfit.dressMesh);
    if(dressMesh)
        dressMesh.visible = true;

    let noseMesh = noses.find(mesh => mesh.name === outfit.noseMesh);
    if(noseMesh)
        noseMesh.visible = true;

    let glassesMesh = glasses.find(mesh => mesh.name === outfit.glassesMesh);
    if(glassesMesh)
        glassesMesh.visible = true;

    let mouthLipsMesh = mouthLips.find(mesh => mesh.name === outfit.mouthLipsMesh);
    if(mouthLipsMesh)
        mouthLipsMesh.visible = true;

    let eyeBrowsMesh = eyeBrows.find(mesh => mesh.name === outfit.eyeBrowsMesh);
    if(eyeBrowsMesh)
        eyeBrowsMesh.visible = true;

    let eyeLashesMesh = eyeLashes.find(mesh => mesh.name === outfit.eyeLashesMesh);
    if(eyeLashesMesh)
        eyeLashesMesh.visible = true;

    let eyeLidsMesh = eyeLids.find(mesh => mesh.name === outfit.eyeLidsMesh);
    if(eyeLidsMesh)
        eyeLidsMesh.visible = true;
    
    let eyeMesh = eyes.find(mesh => mesh.name === outfit.eyeMesh);
    if(eyeMesh)
        eyeMesh.visible = true;
    
    let avatarSkinMesh = avatarSkins.find(mesh => mesh.name === outfit.avatarSkinMesh);
    if(avatarSkinMesh)
        avatarSkinMesh.visible = true;

    let pantsMesh = pants.find(mesh => mesh.name === outfit.pantsMesh);
    if(pantsMesh)
        pantsMesh.visible = true;

    let skirtMesh = skirts.find(mesh => mesh.name === outfit.skirtMesh);
    if(skirtMesh)
        skirtMesh.visible = true;
    
    

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
    debugger;
    if(shirtMesh)
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