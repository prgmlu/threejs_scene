import React, { useState, useEffect } from 'react';
import ColorTone from '../ColorTone';

import hair from '../../static/avatar/menus/hair_long.png';
import eyelash from '../../static/avatar/menus/eyelash.png';
import eye from '../../static/avatar/menus/eye.png';
import check from '../../static/avatar/menus/check.png';
import d_hair from '../../static/avatar/demo/demo_hair.png';
import d_eyelash from '../../static/avatar/demo/demo_eyelashes.png';
import d_eye from '../../static/avatar/demo/demo_eyes.png';

const Face = () => {
	const [selectedStyle, setSelectedStyle] = useState(0);
	const [dataTones, setDataTones] = useState([]);
	const [selectedTone, setSelectedTone] = useState(0);
	const titles = ['Hair', 'Eyebrows', 'Eyes'];
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
			}
		}
		setDataTones([...temp]);
	};

	return (
		<div className="w-full h-full flex flex-col">
			<div className="w-full h-full flex flex-col px-2">
				<div className="flex flex-col gap-2">
					<div className="w-full flex flex-wrap items-center justify-between">
						<img
							className={`w-24 sm:w-[70px] md:w-[27%] h-99 object-contain rounded px-4 py-2 cursor-pointer shadow-md ${
								selectedTone === 0
									? 'bg-white border-[1.5px] border-black'
									: 'bg-white/50'
							}`}
							src={hair}
							alt="HAIR"
							onClick={() => setSelectedTone(0)}
						/>
						<img
							className={`w-24 sm:w-[70px] md:w-[27%] h-99 object-contain rounded px-4 py-2 cursor-pointer shadow-md ${
								selectedTone === 1
									? 'bg-white border-[1.5px] border-black'
									: 'bg-white/50'
							}`}
							src={eyelash}
							alt="EYELASH"
							onClick={() => setSelectedTone(1)}
						/>
						<img
							className={`w-24 sm:w-[70px] md:w-[27%] h-99 object-contain rounded px-4 py-2 cursor-pointer shadow-md ${
								selectedTone === 2
									? 'bg-white border-[1.5px] border-black'
									: 'bg-white/50'
							}`}
							src={eye}
							alt="EYE"
							onClick={() => setSelectedTone(2)}
						/>
					</div>
				</div>
				<ColorTone title={titles[selectedTone]} />
				<div className="w-full h-full flex flex-wrap justify-between gap-y-1 px-1 pb-2 sm:my-2 overflow-y-auto scrollbar-[2px] scrollbar-thumb-gray-500 scrollbar-track-gray-200">
					{dataTones.map((item, index) => (
						<div key={index} className="w-fit h-fit relative p-1">
							{selectedStyle === index && (
								<span className="absolute top-0 right-0 w-3 h- object-contain">
									<img src={check} alt="o" />
								</span>
							)}
							<img
								src={item}
								className={`w-[70px] sm:w-[72px] h-99 object-contain rounded px-2 py-11 cursor-pointer shadow-md bg-white ${
									selectedStyle === index &&
									'border-2 border-[#FF9F9F]'
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

export default Face;
