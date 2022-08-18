import { USE_OLD_CHARACTER_MODEL } from "./CustomizationConstants"

export const maleOutfits = [
    {
        "type": "Pants",
        "name": "Pants_blue",
        "displayImage": "https://cdn.obsess-vr.com/realtime3d/static/avatar/outfit/male/display/Pants_blue.png",
        "textureImage": "https://cdn.obsess-vr.com/realtime3d/static/avatar/outfit/male/display/Pants_blue.png",
    },
    {
        "type": "Pants",
        "name": "Pants_grey",
        "displayImage": "https://cdn.obsess-vr.com/realtime3d/static/avatar/outfit/male/display/Pants_grey.png",
        "textureImage": "https://cdn.obsess-vr.com/realtime3d/static/avatar/outfit/male/display/Pants_grey.png",
    },
    {
        "type": "Pants",
        "name": "Pants_white",
        "displayImage": "https://cdn.obsess-vr.com/realtime3d/static/avatar/outfit/male/display/Pants_white.png",
        "textureImage": "https://cdn.obsess-vr.com/realtime3d/static/avatar/outfit/male/display/Pants_white.png",
    },
    {
        "type": "Shirt",
        "name": "Shirt_green",
        "displayImage": "https://cdn.obsess-vr.com/realtime3d/static/avatar/outfit/male/display/Shirt_green.png",
        "textureImage": "https://cdn.obsess-vr.com/realtime3d/static/avatar/outfit/male/display/Shirt_green.png",
    },
    {
        "type": "Shirt",
        "name": "Shirt_red",
        "displayImage": "https://cdn.obsess-vr.com/realtime3d/static/avatar/outfit/male/display/Shirt_red.png",
        "textureImage": "https://cdn.obsess-vr.com/realtime3d/static/avatar/outfit/male/display/Shirt_red.png",
    },
    {
        "type": "Shirt",
        "name": "Shirt_white",
        "displayImage": "https://cdn.obsess-vr.com/realtime3d/static/avatar/outfit/male/display/Shirt_white.png",
        "textureImage": "https://cdn.obsess-vr.com/realtime3d/static/avatar/outfit/male/display/Shirt_white.png",
    }
]

export const femaleOutfits = [
    {
        "name": "0",
        "displayImage":"https://cdn.obsess-vr.com/realtime3d/outfits/image (7).png"
    },
    {
        "name": "1",
        "displayImage":"https://cdn.obsess-vr.com/realtime3d/outfits/image (8).png"
    },
    {
        "name": "2",
        "displayImage":"https://cdn.obsess-vr.com/realtime3d/outfits/image (9).png"
    },
    {
        "name": "3",
        "displayImage":"https://cdn.obsess-vr.com/realtime3d/outfits/image (10).png"
    },
]


let OLD_BLONDE_TEXTURES = ["https://cdn.obsess-vr.com/realtime3d/hair/Hair1Blonde_D.png","https://cdn.obsess-vr.com/realtime3d/hair/Hair2Blonde_D.png","https://cdn.obsess-vr.com/realtime3d/hair/Hair3Blonde_D.png"];

let OLD_BROWN_TEXTURES = ["https://cdn.obsess-vr.com/realtime3d/hair/Hair1Brown_D.png","https://cdn.obsess-vr.com/realtime3d/hair/Hair2Brown_D.png","https://cdn.obsess-vr.com/realtime3d/hair/Hair3Brown_D.png"];

let OLD_RED_TEXTURES = ["https://cdn.obsess-vr.com/realtime3d/hair/Hair1Red_D.png","https://cdn.obsess-vr.com/realtime3d/hair/Hair2Red_D.png","https://cdn.obsess-vr.com/realtime3d/hair/Hair3Red_D.png"];


let NEW_BLONDE_TEXTURES = ["https://cdn.obsess-vr.com/realtime3d/new_avatar/Hair2Blonde_D.png","https://cdn.obsess-vr.com/realtime3d/new_avatar/Hair3Blonde_D.png","https://cdn.obsess-vr.com/realtime3d/new_avatar/hair4Blonde_D.png"];

let NEW_BROWN_TEXTURES = ["https://cdn.obsess-vr.com/realtime3d/new_avatar/Hair2Brown_D.png","https://cdn.obsess-vr.com/realtime3d/new_avatar/Hair3Brown_D.png","https://cdn.obsess-vr.com/realtime3d/new_avatar/hair4Brown_D.png"];
let NEW_RED_TEXTURES = ["https://cdn.obsess-vr.com/realtime3d/new_avatar/Hair2Red_D.png","https://cdn.obsess-vr.com/realtime3d/new_avatar/Hair3Red_D.png","https://cdn.obsess-vr.com/realtime3d/new_avatar/hair4Red_D.png"];


export const BLONDE_HAIR_TEXTURES = USE_OLD_CHARACTER_MODEL? OLD_BLONDE_TEXTURES : NEW_BLONDE_TEXTURES;
export const BROWN_HAIR_TEXTURES = USE_OLD_CHARACTER_MODEL? OLD_BROWN_TEXTURES : NEW_BROWN_TEXTURES;
export const RED_HAIR_TEXTURES = USE_OLD_CHARACTER_MODEL? OLD_RED_TEXTURES : NEW_RED_TEXTURES;

export const femaleHair = [

    {
        "name":"BlondeHair1",
        "displayImage":"https://cdn.obsess-vr.com/realtime3d/hair/0.jpg",
        "textureImage":BLONDE_HAIR_TEXTURES[0]
    }
    ,
    {
        "name":"BrownHair1",
        "displayImage":"https://cdn.obsess-vr.com/realtime3d/hair/1.jpg",
        "textureImage":BROWN_HAIR_TEXTURES[0],
    }
    ,
    {
        "name":"RedHair1",
        "displayImage":"https://cdn.obsess-vr.com/realtime3d/hair/2.jpg",
        "textureImage":RED_HAIR_TEXTURES[0],
    }
    ,
    {
        "name":"BlondeHair2",
        "displayImage":"https://cdn.obsess-vr.com/realtime3d/hair/3.jpg",
        "textureImage":BLONDE_HAIR_TEXTURES[1],
    }
    ,
    {
        "name":"BrownHair2",
        "displayImage":"https://cdn.obsess-vr.com/realtime3d/hair/4.jpg",
        "textureImage":BROWN_HAIR_TEXTURES[1],
    }
    ,
    {
        "name":"RedHair2",
        "displayImage":"https://cdn.obsess-vr.com/realtime3d/hair/5.jpg",
        "textureImage":RED_HAIR_TEXTURES[1],
    }
    ,
    {
        "name":"BlondeHair3",
        "displayImage":"https://cdn.obsess-vr.com/realtime3d/hair/6.jpg",
        "textureImage":BLONDE_HAIR_TEXTURES[2],
    }
    ,
    {
        "name":"BrownHair3",
        "displayImage":"https://cdn.obsess-vr.com/realtime3d/hair/8.jpg",
        "textureImage":BROWN_HAIR_TEXTURES[2],
    }
    ,
    {
        "name":"RedHair3",
        "displayImage":"https://cdn.obsess-vr.com/realtime3d/hair/7.jpg",
        "textureImage":RED_HAIR_TEXTURES[2],
    }
    ,


]

export const femaleShirts = [
    {
        "name":"BlackShirt2",
        "displayImage":"https://cdn.obsess-vr.com/realtime3d/1.jpg",
        "textureImage":"https://cdn.obsess-vr.com/realtime3d/Shirt2Black_D.png",
    },
    {
        "name":"PinkShirt2",
        "displayImage":"https://cdn.obsess-vr.com/realtime3d/2.jpg",
        "textureImage":"https://cdn.obsess-vr.com/realtime3d/Shirt2Pink_D.png",
    },
    {
        "name":"WhiteShirt2",
        "displayImage":"https://cdn.obsess-vr.com/realtime3d/0.jpg",
        "textureImage":"https://cdn.obsess-vr.com/realtime3d/Shirt2White_D.png",
    },
]

export const femalePants = [
    {
        "name":"BlackShirt2",
        "displayImage":"https://cdn.obsess-vr.com/realtime3d/pants/0.jpg",
        "textureImage":"https://cdn.obsess-vr.com/realtime3d/Pants2Black_D.png",
    },
    {
        "name":"GreyPants2",
        "displayImage":"https://cdn.obsess-vr.com/realtime3d/pants/2.jpg",
        "textureImage":"https://cdn.obsess-vr.com/realtime3d/Pants2Grey_D.png",
    },
    {
        "name":"BluePants2",
        "displayImage":"https://cdn.obsess-vr.com/realtime3d/pants/1.jpg",
        "textureImage":"https://cdn.obsess-vr.com/realtime3d/Pants2Blue_D.png",
    },
]