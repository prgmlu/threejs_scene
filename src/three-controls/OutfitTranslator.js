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

export const setMeshTexture  = (mesh, url) =>{
    let textureLoader = new THREE.ImageBitmapLoader();
    textureLoader.load(url, (imageBitmap) => {
        const texture = new THREE.CanvasTexture(imageBitmap);
        mesh.material.map = texture;
        mesh.material.needsUpdate = true
    });
}

export const getOutfitParts = (model, hide = false) => {
    let hairs = [];
    let pants = [];
    let shirts = [];

    model.traverse((child) => {
        if (child.isMesh) {
            if (child.name.includes("Hair")) {
                hairs.push(child);
                if (hide) {
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

    let {
        hairs,
        pants,
        shirts
    } = getOutfitParts(model, true);

    let hairMesh = hairs.find(mesh => mesh.name === outfit.hairMesh);
    hairMesh.visible = true;

    if (outfit.hairColor == 'red') {
        setMeshTexture(hairMesh, RED_HAIR_TEXTURE);
    }
    if (outfit.hairColor == 'brown') {
        setMeshTexture(hairMesh, BROWN_HAIR_TEXTURE);
    }
    if (outfit.hairColor == 'blonde') {
        setMeshTexture(hairMesh, BLONDE_HAIR_TEXTURE);
    }

    let pantsMesh = pants.find(mesh => mesh.name === outfit.pantsMesh);
    pantsMesh.visible = true;

    if (outfit.pantsColor == 'blue') {
        setMeshTexture(pantsMesh, BLUE_PANTS_TEXTURE);
    }
    if (outfit.pantsColor == 'grey') {
        setMeshTexture(pantsMesh, GREY_PANTS_TEXTURE);
    }
    if (outfit.pantsColor == 'black') {
        setMeshTexture(pantsMesh, BLACK_PANTS_TEXTURE);
    }

    let shirtMesh = shirts.find(mesh => mesh.name === outfit.shirtMesh);
    shirtMesh.visible = true;

    if (outfit.shirtColor == 'pink') {
        setMeshTexture(shirtMesh, PINK_SHIRT_TEXTURE);
    }
    if (outfit.shirtColor == 'white') {
        setMeshTexture(shirtMesh, WHITE_SHIRT_TEXTURE);
    }
    if (outfit.shirtColor == 'black') {
        setMeshTexture(shirtMesh, BLACK_SHIRT_TEXTURE);
    }
}



window.setMeshTexture = setMeshTexture;
window.getOutfitParts = getOutfitParts;
window.getOutfitStringFromModel = getOutfitStringFromModel;
window.dressUpFromString = dressUpFromString;