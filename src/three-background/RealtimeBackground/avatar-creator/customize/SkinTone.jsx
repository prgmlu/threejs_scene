import React, { useState } from 'react';
import hair from '../../static/avatar/menus/hair.png';
import eyelash from '../../static/avatar/menus/eyelash.png';
import eye from '../../static/avatar/menus/eye.png';
import lip from '../../static/avatar/menus/lip.png';
import mustache from '../../static/avatar/menus/mustache.png';
import eyeglass from '../../static/avatar/menus/eyeglass.png';
import brush from '../../static/avatar/menus/brush.png';
import check from '../../static/avatar/menus/check.png';
import ColorTone from '../ColorTone';

import d_hair from '../../static/avatar/demo/demo_hair.png';
import d_eyelash from '../../static/avatar/demo/demo_eyelashes.png';
import d_eye from '../../static/avatar/demo/demo_eyes.png';
import d_mouth from '../../static/avatar/demo/demo_mouth.png';
import d_beard from '../../static/avatar/demo/demo_beard.png';
import d_eyeglasse from '../../static/avatar/demo/demo_eyeglasses.png';
import d_makeup from '../../static/avatar/demo/demo_makeup.png';
import { useEffect } from 'react';

const SkinTone = () => {
	const [selectedStyle, setSelectedStyle] = useState(0);
	const [dataTones, setDataTones] = useState([]);
	const [selectedTone, setSelectedTone] = useState(0);
	const titles = [
		'Hair',
		'Eyebrows',
		'Eyes',
		'Mouth',
		'Facial Hair',
		'Galsses',
		'Makeup',
	];
	const demo_items_count = 30;

	useEffect(() => {
		getContents(selectedTone);
	}, [selectedTone]);

	const getContents = (index) => {
		let temp = [];
		for (let i = 0; i < demo_items_count; i++) {
			switch (index) {
				case 0:
					temp.push(d_hair);
					break;
				case 1:
					temp.push(d_eyelash);
					break;
				case 2:
					temp.push(d_eye);
					break;
				case 3:
					temp.push(d_mouth);
					break;
				case 4:
					temp.push(d_beard);
					break;
				case 5:
					temp.push(d_eyeglasse);
					break;
				case 6:
					temp.push(d_makeup);
			}
		}
		setDataTones([...temp]);
	};

	return (
		<div className="w-full h-full flex flex-col">
			<div className="w-full h-full flex flex-col px-2">
				<div className="flex flex-col gap-2">
					<div className="w-full flex flex-wrap items-center justify-between ">
						<img
							className={`w-[70px] h-88 object-contain rounded px-4 py-2 cursor-pointer shadow-md ${
								selectedTone === 0
									? 'bg-white border-[1.5px] border-black'
									: 'bg-white/50'
							}`}
							src={hair}
							alt="HAIR"
							onClick={() => setSelectedTone(0)}
						/>
						<img
							className={`w-[70px] h-88 object-contain rounded px-4 py-2 cursor-pointer shadow-md ${
								selectedTone === 1
									? 'bg-white border-[1.5px] border-black'
									: 'bg-white/50'
							}`}
							src={eyelash}
							alt="EYELASH"
							onClick={() => setSelectedTone(1)}
						/>
						<img
							className={`w-[70px] h-88 object-contain rounded px-4 py-2 cursor-pointer shadow-md ${
								selectedTone === 2
									? 'bg-white border-[1.5px] border-black'
									: 'bg-white/50'
							}`}
							src={eye}
							alt="EYE"
							onClick={() => setSelectedTone(2)}
						/>
						<img
							className={`w-[70px] h-88 object-contain rounded px-4 py-2 cursor-pointer shadow-md ${
								selectedTone === 3
									? 'bg-white border-[1.5px] border-black'
									: 'bg-white/50'
							}`}
							src={lip}
							alt="LIP"
							onClick={() => setSelectedTone(3)}
						/>
					</div>
					<div className="w-full flex flex-wrap items-center justify-center gap-x-4">
						<img
							className={`w-[70px] h-88 object-contain rounded px-4 py-2 cursor-pointer shadow-md ${
								selectedTone === 4
									? 'bg-white border-[1.5px] border-black'
									: 'bg-white/50'
							}`}
							src={mustache}
							alt="MUSTACHE"
							onClick={() => setSelectedTone(4)}
						/>
						<img
							className={`w-[70px] h-88 object-contain rounded px-4 py-2 cursor-pointer shadow-md ${
								selectedTone === 5
									? 'bg-white border-[1.5px] border-black'
									: 'bg-white/50'
							}`}
							src={eyeglass}
							alt="EYEGALSHH"
							onClick={() => setSelectedTone(5)}
						/>
						<img
							className={`w-[70px] h-88 object-contain rounded px-4 py-2 cursor-pointer shadow-md ${
								selectedTone === 6
									? 'bg-white border-2 border-black'
									: 'bg-white/50'
							}`}
							src={brush}
							alt="BRUSH"
							onClick={() => setSelectedTone(6)}
						/>
					</div>
				</div>
				<ColorTone title={titles[selectedTone]} />
				<div className="w-full h-full flex flex-wrap justify-between gap-y-2 px-1 pb-2 sm:my-2 overflow-y-auto scrollbar-[4px] scrollbar-thumb-gray-500 scrollbar-track-gray-200">
					{dataTones.map((item, index) => (
						<div key={index} className="w-fit h-fit relative">
							{selectedStyle === index && (
								<span className="absolute -top-1 -right-1 w-3 h- object-contain">
									<img src={check} alt="o" />
								</span>
							)}
							<img
								src={item}
								className={`w-14 h-88 object-contain rounded px-2 py-1 cursor-pointer shadow-md bg-white ${
									selectedStyle === index &&
									'border-2 border-green-400'
								}`}
								alt=""
								onClick={() => setSelectedStyle(index)}
							/>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default SkinTone;
