import React from 'react';
import check from '../../static/avatar/menus/check.png';

const Outfit = ({ maleOutfits, selectedOutfit, setOutfit }) => {
	return (
		<div className="w-full h-full flex flex-col gap-2 overflow-y-auto">
			<div className="font-sourceSansProSemibold text-lg">Outfit</div>
			<div className="w-full h-fit max-h-[95%] flex flex-wrap gap-2 overflow-y-auto py-1 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
				{maleOutfits.display.map((outfit, index) => (
					<div key={index} className="w-fit h-fit relative">
						{selectedOutfit === index && (
							<img
								className="absolute z-50 w-4 h-4 -top-1 -right-1"
								src={check}
								alt="SELECTED"
							/>
						)}
						<img
							id={outfit.name}
							src={outfit}
							className={`w-[60px] sm:w-24 h-fit object-cover bg-white p-[2px] rounded-md cursor-pointer ${
								selectedOutfit === index &&
								'border-2 border-[#FF9F9F]'
							}`}
							onClick={(e) => setOutfit(e, index)}
						/>
					</div>
				))}
			</div>
		</div>
	);
};

export default Outfit;
