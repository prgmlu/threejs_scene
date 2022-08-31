import React from 'react';
import check from '../../static/avatar/menus/check.png';
import {setMeshTextureImage} from '../../../../three-controls/OutfitTranslator';

let swapSkinTexture = (textureIndex, mesh) => {
	let url =  `https://cdn.obsess-vr.com/realtime3d/skintones/Sk${textureIndex}_FemaleAvatar_D.png`;
	setMeshTextureImage(mesh, url);
	// console.log(url);
	
}

const SkinTone = ({ color, x, y, selectedIndex, setSelectedIndex, counter, mesh }) => {
	return (
		<div className="w-fit h-fit relative">
			{x === selectedIndex.x && y === selectedIndex.y && (
				<span className="absolute top-0 right-0 w-3 h-3 object-contain">
					<img src={check} alt="o" />
				</span>
			)}
			<button
				onClick={() => {setSelectedIndex({ x: x, y: y }); swapSkinTexture(counter, mesh)}}
				style={{ backgroundColor: color }}
				className={`w-10 sm:w-12 h-10_ sm:h-12 rounded-full cursor-pointer border-2 ${
					x === selectedIndex.x &&
					y === selectedIndex.y &&
					'border-[#FF9F9F]'
				}`}
			></button>
		</div>
	);
};

export default SkinTone;
