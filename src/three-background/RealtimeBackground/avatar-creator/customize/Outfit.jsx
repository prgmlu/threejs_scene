import React from 'react';
import check from '../../static/avatar/menus/check.png';
let switchOutfit = (e, index, currentAvatar, femaleLocalAvatarOutfitStringRef, maleLocalAvatarOutfitStringRef, visibleGender) => {
	let outfitNames = [
		'Outfit1',
		'Outfit2',
		'Outfit3',
		'Outfit4',
		'Outfit5',
	];

	// make them all invisible
	for (let i = 0; i < outfitNames.length; i++) {
		// currentAvatar.getObjectByName(outfitNames[i]).visible = false;
		window.femaleModel.getObjectByName(outfitNames[i]).visible = false;
		window.maleModel.getObjectByName(outfitNames[i]).visible = false;
	}

	// make the selected one visible
	// currentAvatar.getObjectByName(outfitNames[index]).visible = true;
	window.maleModel.getObjectByName(outfitNames[index]).visible = true;
	window.femaleModel.getObjectByName(outfitNames[index]).visible = true;
	if(visibleGender == 'male'){
		updateOutfitString(outfitNames[index], maleLocalAvatarOutfitStringRef);
	}
	else{
		updateOutfitString(outfitNames[index], femaleLocalAvatarOutfitStringRef);
	}
}

let updateOutfitString = (outfitName, ref) => {
	let u = JSON.parse(ref.current)
	u.outfitMesh=outfitName;
	ref.current = JSON.stringify(u);
}

const Outfit = ({ maleOutfits, selectedOutfit, setOutfit, currentAvatar, femaleLocalAvatarOutfitStringRef, maleLocalAvatarOutfitStringRef, visibleGenderRef }) => {
	return (
		<div className="w-full h-full flex flex-col gap-1 scrollbar">
			<div className="font-sourceSansProSemibold text-lg">Outfit</div>
			<div className="w-full h-fit max-h-[80%] flex flex-wrap justify-center gap-2 pl-2 pr-1 pb-2 sm:my-2  overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200">
				{maleOutfits.display.map((outfit, index) => (
					<div
						key={index}
						className={`w-[30%] sm:h-fit h-[6rem]  bg-[#B9B9B9] py-[0rem] sm"py-[0.5rem] relative rounded-md px-3 shadow-md mb-3 ${
							selectedOutfit === index &&
							'border-2 border-[#FF9F9F]'
						}`}
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
							className={`w-[100%] bg-[#B9B9B9] h-[100%]  object-cover p-[2px] rounded-md cursor-pointer`}
							onClick={(e) => {setOutfit(e, index); switchOutfit(e, index, currentAvatar, femaleLocalAvatarOutfitStringRef, maleLocalAvatarOutfitStringRef, visibleGenderRef.current) }}
						/> 
					</div>
				))}
			</div>
		</div>
	);
};

export default Outfit;
