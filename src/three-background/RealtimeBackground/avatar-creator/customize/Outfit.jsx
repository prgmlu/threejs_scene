import React from 'react';
import check from '../../static/avatar/menus/check.png';

let switchOutfit = (e, index, currentAvatar) => {
	let outfitNames = [
		'Outfit1',
		'Outfit2',
		'Outfit3',
		'Outfit4',
		'Outfit5',
	];

	// make them all invisible
	for (let i = 0; i < outfitNames.length; i++) {
		currentAvatar.getObjectByName(outfitNames[i]).visible = false;
	}

	// make the selected one visible
	currentAvatar.getObjectByName(outfitNames[index]).visible = true;

}

const Outfit = ({ maleOutfits, selectedOutfit, setOutfit, currentAvatar }) => {
	return (
		<div className="w-full h-full flex flex-col gap-1 scrollbar">
			<div className="font-sourceSansProSemibold text-lg">Outfit</div>
			<div className="w-full h-fit max-h-[95%] flex flex-wrap gap-2 overflow-x-hidden overflow-y-auto py-1 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
				{maleOutfits.display.map((outfit, index) => (
					<div
						key={index}
						className="w-fit h-fit relative rounded-md"
					>
						{selectedOutfit === index && (
							<img
								className="absolute z-50 w-4 h-4 -top-1 -right-1"
								src={"https://cdn.obsess-vr.com/realtime3d/ct_ui/check.svg"}
								alt="SELECTED"
							/>
						)}
						<img
							id={outfit.name}
							src={outfit}
							className={`w-[60px] sm:w-24 h-28 object-cover bg-white p-[2px] rounded-md cursor-pointer ${
								selectedOutfit === index &&
								'border-2 border-[#FF9F9F]'
							}`}
							onClick={(e) => {setOutfit(e, index); switchOutfit(e, index, currentAvatar) }}
						/>
					</div>
				))}
			</div>
		</div>
	);
};

export default Outfit;
