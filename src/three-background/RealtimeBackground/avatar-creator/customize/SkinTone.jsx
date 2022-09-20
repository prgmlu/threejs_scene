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
		<button
			onClick={() => {
				setSelectedIndex(x, y);
				swapSkinTexture(counter, mesh, selectedMakeup);
				setSelectedSkintone(counter);
			}}
			className={`w-[32px] sm:w-12 md:w-[80px] lg:w-28 h-[32px] sm:h-12 md:h-[80px] lg:h-28 rounded-full relative`}
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
					<img src={check} alt="o" />
				</span>
			)}
		</button>
	);
};

export default SkinTone;
