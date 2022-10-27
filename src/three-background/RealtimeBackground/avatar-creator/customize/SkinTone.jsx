import React from 'react';
import check from '../../static/avatar/menus/check.png';
import { setMeshTextureImage } from '../../../../three-controls/CharacterControls/OutfitTranslator.js';

let updateOutfitString = (femaleLocalAvatarOutfitStringRef, maleLocalAvatarOutfitStringRef, visibleGenderRef, index) => {
	if(visibleGenderRef.current == 'female'){
		let parsed = JSON.parse(femaleLocalAvatarOutfitStringRef.current);
		parsed.skinTone = index;
		//update ref
		femaleLocalAvatarOutfitStringRef.current = JSON.stringify(parsed);	
	}
	else{
		//handle male case if needed
	}
}

let swapSkinTexture = (textureIndex, mesh, selectedMakeup) => {
	let url;
	if (selectedMakeup || selectedMakeup === 0) {
		url = `https://cdn.obsess-vr.com/realtime3d/new_uv_skintones/Sk${textureIndex}_FemaleAvatar${
			selectedMakeup + 1
		}_D.png`;
	} else
		url = `https://cdn.obsess-vr.com/realtime3d/new_uv_skintones_only/Sk${textureIndex}_FemaleAvatar_D.png`;

	console.log(url);
	// let url = `https://cdn.obsess-vr.com/realtime3d/skintone-makeup-512/Sk${randomNumber}_FemaleAvatar${randomNumber2}_D.png`;

	setMeshTextureImage(mesh, url);
	// console.log(url);
};

const SkinTone = ({
	color,
	x,
	y,
	selectedIndex,
	skintoneX,
	selectedMakeup,
	skintoneY,
	setSelectedIndex,
	counter,
	mesh,
	setSelectedSkintone,
	femaleLocalAvatarOutfitStringRef,
	maleLocalAvatarOutfitStringRef,
	visibleGenderRef,
}) => {
	return (
		<button
			onClick={() => {
				setSelectedIndex(x, y);
				swapSkinTexture(counter, mesh, selectedMakeup);
				updateOutfitString(femaleLocalAvatarOutfitStringRef, maleLocalAvatarOutfitStringRef, visibleGenderRef, counter);
				setSelectedSkintone(counter);
			}}
			className={`w-[50px] sm:w-12 lg:w-[4.5rem] xl:w-[5rem] xl:h-[5rem] lg:h-[4.5rem] h-[50px] sm:h-12 rounded-full relative`}
			style={{ 
				backgroundColor: color,
				border: `${
					x === skintoneX && y === skintoneY
						? '2px solid #FF9F9F'
						: 'none'
				}`,
			}}
		>
			{x === skintoneX && y === skintoneY && (
				<span className="absolute top-0 right-0 w-2.5 sm:w-3 h-2.5 sm:h-3 object-contain">
					{/* <img src={"https://cdn.obsess-vr.com/realtime3d/ct_ui/check.svg"} alt="o" /> */}
					<img src={check} alt="o" />
				</span>
			)}
		</button>
	);
};

export default SkinTone;
