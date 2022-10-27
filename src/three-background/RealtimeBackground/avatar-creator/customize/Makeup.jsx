import React, { useState, useEffect } from 'react';
import ColorTone from '../ColorTone';

import hair from '../../static/avatar/menus/hair_short.png';
import eyelash from '../../static/avatar/menus/eyelash.png';
import eye from '../../static/avatar/menus/eye.png';
import check from '../../static/avatar/menus/check.png';
// import makeup_one from '../../static/avatar/makeup/make1.png';
import { setMeshTextureImage } from '../../../../three-controls/CharacterControls/OutfitTranslator.js';

let updateOutfitString = (
	femaleLocalAvatarOutfitStringRef,
	maleLocalAvatarOutfitStringRef,
	visibleGenderRef,
	index,
) => {
	if (visibleGenderRef.current == 'female') {
		let parsed = JSON.parse(femaleLocalAvatarOutfitStringRef.current);
		parsed.makeup = index;
		//update ref
		femaleLocalAvatarOutfitStringRef.current = JSON.stringify(parsed);
	} else {
		//handle male case if needed
	}
};

let setMakeupFromTexture = (index, currentAvatar, selectedSkintone) => {
	let ind = index + 1;
	let url = `https://cdn.obsess-vr.com/realtime3d/new_uv_skintones/Sk${selectedSkintone}_FemaleAvatar${ind}_D.png`;
	// let url = `https://cdn.obsess-vr.com/realtime3d/tones_new/Sk${selectedSkintone}_FemaleAvatar${ind}_D.png`;
	console.log(url);
	// swap the texture of the mesh
	let mesh = currentAvatar.getObjectByName('FemaleAvatar_Head');
	setMeshTextureImage(mesh, url);
	addRoughness(currentAvatar);
	// return;
};

let addRoughness = (currentAvatar) => {
	let roughnessTextureUrl =
		'https://cdn.obsess-vr.com/realtime3d/roughness/Sk_FemaleAvatar_R.png';
	let roughnessTexture = new THREE.TextureLoader().load(roughnessTextureUrl);
	let mesh = currentAvatar.getObjectByName('FemaleAvatar_Head');
	mesh.material.roughnessMap = roughnessTexture;
	mesh.material.needsUpdate = true;
};

const Makeup = ({
	selectedSkintone,
	setSelectedMakeup,
	currentAvatar,
	selectedMakeup,
	femaleLocalAvatarOutfitStringRef,
	maleLocalAvatarOutfitStringRef,
	visibleGenderRef,
}) => {
	const [selectedStyle, setSelectedStyle] = useState(0);
	const [dataTones, setDataTones] = useState([]);
	const [selectedTone, setSelectedTone] = useState(0);
	const titles = ['Makeup', 'Eyebrows', 'Eyes'];
	const demo_items_count = 30;
	//const nameList = ['Kate', 'Meg', 'Lily', 'Tosin', 'Jourdan'];
	let makeupImages = [
		'https://cdn.obsess-vr.com/realtime3d/placeholders/makeup1.png',
		'https://cdn.obsess-vr.com/realtime3d/placeholders/makeup2.png',
		'https://cdn.obsess-vr.com/realtime3d/placeholders/makeup3.png',
		'https://cdn.obsess-vr.com/realtime3d/placeholders/makeup4.png',
		'https://cdn.obsess-vr.com/realtime3d/placeholders/makeup5.png',
	];

	useEffect(() => {
		getContents(selectedTone);
	}, [selectedTone]);

	const getContents = (index) => {
		let temp = [];
		for (let i = 0; i < makeupImages.length; i++) {
			switch (index) {
				case 0:
					temp.push(makeupImages[i]);
					break;
				case 1:
					temp.push(makeupImages[i]);
					break;
				case 2:
					temp.push(makeupImages[i]);
					break;
			}
		}
		setDataTones([...temp]);
	};

	return (
		<div className="w-full h-full flex flex-col">
			<div className="w-full h-full flex flex-col px-2">
				<div className="font-sourceSansProSemibold text-lg">Makeup</div>
				<div className="w-full h-fit max-h-[80%] flex flex-wrap justify-center pl-2 overflow-x-hidden pr-1 justify-center pb-2 sm:my-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200">
					{dataTones.map((item, index) => (
						<div key={index} className=" w-[31%] px-1 md:w-[30%] mb-3 h-fit relative">
							{/* <div
								className="absolute p-[2px] lg:p-[4px] text-[7px] lg:text-[10px] xl:text-[12px] bg-[#330D0D] text-[#FF9F9F] text-center bottom-[2px]"
								style={{
									left: selectedMakeup === index ?  '6px' : '4px',
									right: selectedMakeup === index ? '6px' : '4px',
									textAlign: 'center',
									borderRadius: '0px 0px 4px 4px',
									bottom: selectedMakeup === index ? '2px' : '0px',
								}}
							>
								{nameList[index]}
							</div> */}
							{selectedMakeup === index && (
								<span className="absolute top-[-1px] right-[-2px] md:w-[1.5rem] md:h-[1.5rem] h-[1rem] w-[1rem] object-contain">
									<img
										src={
											'https://cdn.obsess-vr.com/realtime3d/ct_ui/check.svg'
										}
										alt="o"
									/>
								</span>
							)}
							<img
								src={item}
								className={`w-full h-full object-cover rounded cursor-pointer shadow-md bg-white ${
									selectedMakeup === index &&
									'border-2 border-[#FF9F9F]'
								}`}
								alt=""
								onClick={() => {
									setSelectedStyle(index);
									setSelectedMakeup(index);
									updateOutfitString(
										femaleLocalAvatarOutfitStringRef,
										maleLocalAvatarOutfitStringRef,
										visibleGenderRef,
										index,
									);
									setMakeupFromTexture(
										index,
										currentAvatar,
										selectedSkintone,
									);
								}}
							/>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default Makeup;
