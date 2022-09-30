import * as THREE from 'three';

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

let outfitNames = [
    "Outfit1",
    "Outfit2",
    "Outfit3",
    "Outfit4",
    "Outfit5",
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

    let avatarSkins = [];
    let outfits = [];
    
    

    model.traverse((child) => {
            if (child.name.toLowerCase().includes("hair")) {
                hairs.push(child);
                if (hide && hideHair) {
                    child.visible = false;
                }
            }


            if (outfitNames.includes(child.name)){
                outfits.push(child);
                if (hide){
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
            // if (eyeMeshNames.includes(child.name)) {
            //     eyes.push(child);
            //     if (hide) {
            //         child.visible = false;
            //     }
            // }
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
        dresses,
        outfits

    };
    
}



export const dressUpFromString = (model, outfitString) => {

    debugger;

    // a core function that dresses the local model and the remote models

    let outfit = JSON.parse(outfitString);
    // includes meshes, skintone and makeup indices, eyeshape index which is translated using morphTargets
    // {
    //   hairMesh: "Hair1",
    //   outfitMesh: "Mesh5",
    //   skinTone : 1,
    //   makeup: 3
    // }


    if(outfit.skinTone && (outfit.makeup || outfit.makeup == 0)){
            let url = `https://cdn.obsess-vr.com/realtime3d/new_uv_skintones/Sk${outfit.skinTone}_FemaleAvatar${
                outfit.makeup+1
            }_D.png`;
            console.log(url);
            let mesh = model.getObjectByName("FemaleAvatar_Head");
            setMeshTextureImage(mesh, url);
        }
        else if(outfit.skinTone){
            let url = `https://cdn.obsess-vr.com/realtime3d/new_uv_skintones_only/Sk${outfit.skinTone}_FemaleAvatar_D.png`;
            console.log(url);
            let mesh = model.getObjectByName("FemaleAvatar_Head");
            setMeshTextureImage(mesh, url);
        }
        else if(outfit.makeup){
            let url = `https://cdn.obsess-vr.com/realtime3d/new_uv_skintones/Sk1_FemaleAvatar${
                outfit.makeup+1
            }_D.png`;
            console.log(url);

            let mesh = model.getObjectByName("FemaleAvatar_Head");
            setMeshTextureImage(mesh, url);
    }

    if(outfit.eyeShape) {
        let body = model.getObjectByName('FemaleAvatar_Head');
        let influences = body.morphTargetInfluences;
        let EyeShapeCount = 6;
        for (let i = 0; i < EyeShapeCount; i++) {
            influences[i] = 0;
        }
        influences[outfit.eyeShape] = 1;
    }


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
        dresses,
        outfits
    } = getOutfitParts(model, true, (outfit.hairMesh)? true : false);

        if(outfit.hairMesh){
        
        let hairMesh = hairs.find(mesh => mesh.name === outfit.hairMesh);
        if(hairMesh){
            hairMesh.visible = true;
        }

        else{
            let meshNumber = 1;
            if(outfit.hairMesh.includes("3")){
                meshNumber = 2;
            }
            if(outfit.hairMesh.includes("4")){
                meshNumber = 3;
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
    
    // let eyeMesh = eyes.find(mesh => mesh.name === outfit.eyeMesh);
    // if(eyeMesh)
    //     eyeMesh.visible = true;
    
    let avatarSkinMesh = avatarSkins.find(mesh => mesh.name === outfit.avatarSkinMesh);
    if(avatarSkinMesh)
        avatarSkinMesh.visible = true;

    let pantsMesh = pants.find(mesh => mesh.name === outfit.pantsMesh);
    if(pantsMesh)
        pantsMesh.visible = true;

    let skirtMesh = skirts.find(mesh => mesh.name === outfit.skirtMesh);
    if(skirtMesh)
        skirtMesh.visible = true;

    let outfitMesh = outfits.find(mesh => mesh.name === outfit.outfitMesh);
    if(outfitMesh)
        outfitMesh.visible = true;
        
    
    


    let shirtMesh = shirts.find(mesh => mesh.name === outfit.shirtMesh);
    if(shirtMesh)
        shirtMesh.visible = true;


}


window.setMeshTextureImage = setMeshTextureImage;
window.getOutfitParts = getOutfitParts;
window.dressUpFromString = dressUpFromString;