import React, { useState, useEffect } from 'react';
import ColorTone from '../ColorTone';

import hair from '../../static/avatar/menus/hair_short.png';
import eyelash from '../../static/avatar/menus/eyelash.png';
import eye from '../../static/avatar/menus/eye.png';
import check from '../../static/avatar/menus/check.png';
// import makeup_one from '../../static/avatar/makeup/make1.png';
import { setMeshTextureImage } from '../../../../three-controls/OutfitTranslator';

let setMakeupFromTexture = (index, currentAvatar, selectedSkintone) => {
	let ind = index + 1;
	let url = `https://cdn.obsess-vr.com/realtime3d/tones_new/Sk${selectedSkintone}_FemaleAvatar${ind}_D.png`;
	console.log(url);
	// swap the texture of the mesh
	let mesh = currentAvatar.getChildByName('FemaleAvatar_Body1');
	setMeshTextureImage(mesh, url);
	addRoughness(currentAvatar);
	// return;
};

let addRoughness = (currentAvatar) => {
	let roughnessTextureUrl = "https://cdn.obsess-vr.com/realtime3d/roughness/Sk_FemaleAvatar_R.png";
	let roughnessTexture = new THREE.TextureLoader().load(roughnessTextureUrl);
	let mesh = currentAvatar.getChildByName('FemaleAvatar_Body1');
	mesh.material.roughnessMap = roughnessTexture;
	mesh.material.needsUpdate = true;
}

const Makeup = ({
	selectedSkintone,
	setSelectedMakeup,
	currentAvatar,
	selectedMakeup,
}) => {
	const [selectedStyle, setSelectedStyle] = useState(0);
	const [dataTones, setDataTones] = useState([]);
	const [selectedTone, setSelectedTone] = useState(0);
	const titles = ['Makeup', 'Eyebrows', 'Eyes'];
	const demo_items_count = 30;

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
				<div className="w-full h-fit max-h-[80%] flex flex-wrap justify-between gap-1 px-1 pb-2 sm:my-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200">
					{dataTones.map((item, index) => (
						<div key={index} className="w-fit h-fit relative p-1">
							{selectedMakeup === index && (
								<span className="absolute top-0 right-0 w-3 h-3 object-contain">
									<img src={"https://cdn.obsess-vr.com/realtime3d/ct_ui/check.svg"} alt="o" />
								</span>
							)}
							<img
								src={item}
								className={`w-[90px] h-fit object-cover rounded p-1 cursor-pointer shadow-md bg-white ${
									selectedMakeup === index &&
									'border-2 border-[#FF9F9F]'
								}`}
								alt=""
								onClick={() => {
									setSelectedStyle(index);
									setSelectedMakeup(index);
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
