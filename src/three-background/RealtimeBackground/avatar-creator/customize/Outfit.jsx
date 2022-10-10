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
		currentAvatar.getObjectByName(outfitNames[i]).visible = false;
	}

	// make the selected one visible
	currentAvatar.getObjectByName(outfitNames[index]).visible = true;
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
			<div className="w-full h-fit max-h-[80%] flex flex-wrap justify-center pl-2 pr-1 pb-2 sm:my-2  overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200">
				{maleOutfits.display.map((outfit, index) => (
					<div
						key={index}
						className="w-[30%] h-fit relative rounded-md px-3 shadow-md mb-3"
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
							className={`w-[100%] h-[100%] object-cover bg-white p-[2px] rounded-md cursor-pointer ${
								selectedOutfit === index &&
								'border-2 border-[#FF9F9F]'
							}`}
							onClick={(e) => {setOutfit(e, index); switchOutfit(e, index, currentAvatar, femaleLocalAvatarOutfitStringRef, maleLocalAvatarOutfitStringRef, visibleGenderRef.current) }}
						/>

						

					</div>
				))}
			</div>
		</div>
	);
};

export default Outfit;
