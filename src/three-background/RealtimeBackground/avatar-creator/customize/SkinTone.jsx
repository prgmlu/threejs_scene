import React from 'react';
import check from '../../static/avatar/menus/check.png';
import { setMeshTextureImage } from '../../../../three-controls/OutfitTranslator';

let swapSkinTexture = (textureIndex, mesh, selectedMakeup) => {
	let url;
	if (selectedMakeup || selectedMakeup === 0) {
		url = `https://cdn.obsess-vr.com/realtime3d/skintone-makeup-512/Sk${textureIndex}_FemaleAvatar${
			selectedMakeup + 1
		}_D.png`;
	} else
		url = `https://cdn.obsess-vr.com/realtime3d/skintones/Sk${textureIndex}_FemaleAvatar_D.png`;

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
}) => {
	return (
		<div className="w-fit h-fit relative">
			{x === skintoneX && y === skintoneY && (
				<span className="absolute top-0 right-0 w-3 h-3 object-contain">
					<img src={check} alt="o" />
				</span>
			)}
			<button
				onClick={() => {
					setSelectedIndex(x, y);
					swapSkinTexture(counter, mesh, selectedMakeup);
					setSelectedSkintone(counter);
				}}
				style={{ backgroundColor: color }}
				className={`w-10 sm:w-12 h-[40px] sm:h-12 rounded-full cursor-pointer border-2 ${
					x === skintoneX && y === skintoneY && 'border-[#FF9F9F]'
				}`}
			></button>
		</div>
	);
};

export default SkinTone;
