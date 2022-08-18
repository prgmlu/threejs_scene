import { USE_OLD_CHARACTER_MODEL } from "./CustomizationConstants"

export const predeterminedOutfitsNoHair = {
    "0":'{"pantsMesh":"Pants2","shirtMesh":"Shirt","hairColor":null,"pantsColor":"black","shirtColor":null,"shoesMesh":"Shoes", "glassesMesh":"glasses1"}',
    "1":'{"pantsMesh":"Pants2","shirtMesh":"Shirt","hairColor":null,"pantsColor":"blue","shirtColor":null,"shoesMesh":"Shoes", "glassesMesh":"glasses1"}',
    "2":'{"pantsMesh":"Pants","shirtMesh":"Shirt2","hairColor":null,"pantsColor":null,"shirtColor":"black","shoesMesh":"Shoes", "glassesMesh":"glasses1"}',
    "3":'{"pantsMesh":"Pants2","shirtMesh":"Shirt","hairColor":null,"pantsColor":"grey","shirtColor":null,"shoesMesh":"Shoes", "glassesMesh":"glasses1"}'
}


export const predeterminedOutfitsWithHair = USE_OLD_CHARACTER_MODEL? {
    "0":'{"pantsMesh":"Pants2","shirtMesh":"Shirt","hairColor":"Red","pantsColor":"black","shirtColor":null,"hairMesh":"Hair1"}',
    "1":'{"pantsMesh":"Pants2","shirtMesh":"Shirt","hairColor":"Brown","pantsColor":"blue","shirtColor":null,"hairMesh":"Hair2"}',
    "2":'{"pantsMesh":"Pants","shirtMesh":"Shirt2","hairColor":"Brown","pantsColor":null,"shirtColor":"black","hairMesh":"Hair2"}',
    "3":'{"pantsMesh":"Pants2","shirtMesh":"Shirt","hairColor":"Red","pantsColor":"grey","shirtColor":null,"hairMesh":"Hair3"}'
}:
{
    "0":'{"pantsMesh":"Pants2","shirtMesh":"Shirt","hairColor":"Red","pantsColor":"black","shirtColor":null,"hairMesh":"Hair2","shoesMesh":"Shoes","glassesMesh":null}',
    "1":'{"pantsMesh":"Pants2","shirtMesh":"Shirt","hairColor":"Brown","pantsColor":"blue","shirtColor":null,"hairMesh":"Hair3","shoesMesh":"shoes2","glassesMesh":null}',
    "2":'{"pantsMesh":"Pants","shirtMesh":"Shirt2","hairColor":"Brown","pantsColor":null,"shirtColor":"black","hairMesh":"hair4","shoesMesh":"shoes2","glassesMesh":"glasses1"}',
    "3":'{"pantsMesh":"Pants2","shirtMesh":"Shirt","hairColor":"Red","pantsColor":"grey","shirtColor":null,"hairMesh":"Hair3","shoesMesh":"Shoes","glassesMesh":"glasses1"}'
}