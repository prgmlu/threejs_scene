import React from 'react';
import cloth from '../../static/avatar/menus/clothes.png';
import body from '../../static/avatar/menus/body.png';
import skin from '../../static/avatar/menus/skin.png';
import makeup from '../../static/avatar/menus/makeup.png';

const TabControls = ({ activeTab, onTabClick }) => {
	return (
		<div className="w-full sm:w-full md:w-[95%] lg:w-[85%] h-[8%] sm:h-[12%]  flex items-start justify-center gap-3 lg:gap-6">
			<img
				// src={body}
				src={'https://cdn.obsess-vr.com/realtime3d/ct_ui/body.svg'}
				alt="Body type"
				id="1"
				className={`w-[13%] ${
					activeTab === 1
						? 'h-full pb-1.5 sm:pb-3.5 px-1.5 sm:px-2.5'
						: 'h-[80%] pb-1 sm:pb-2 px-1 sm:px-2'
				} pt-2 object-contain rounded-t-md flex justify-center cursor-pointer bg-white`}
				onClick={() => onTabClick(1)}
			/>
			<img
				// src={skin}
				src={'https://cdn.obsess-vr.com/realtime3d/ct_ui/face.svg'}
				alt="Skin tone"
				id="2"
				className={`w-[13%] ${
					activeTab === 2
						? 'h-full pb-1.5 sm:pb-3.5 px-1.5 sm:px-2.5'
						: 'h-[80%] pb-1 sm:pb-2 px-1 sm:px-2'
				} pt-2 object-contain rounded-t-md flex justify-center cursor-pointer bg-white`}
				onClick={() => onTabClick(2)}
			/>
			<img
				src={makeup}
				//src={'https://cdn.obsess-vr.com/realtime3d/ct_ui/makeup.svg'}
				alt="Makeup"
				id="2"
				className={`w-[13%] ${
					activeTab === 3
						? 'h-full pb-1.5 sm:pb-3.5 px-1.5 sm:px-2.5'
						: 'h-[80%] pb-1 sm:pb-2 px-1 sm:px-2'
				} pt-2 object-contain rounded-t-md flex justify-center cursor-pointer bg-white`}
				onClick={() => onTabClick(3)}
			/>
			<img
				// src={cloth}
				src={'https://cdn.obsess-vr.com/realtime3d/ct_ui/outfit.svg'}
				alt="Outfit"
				id="3"
				className={`w-[13%] ${
					activeTab === 4
						? 'h-full pb-1.5 sm:pb-3.5 px-1.5 sm:px-2.5'
						: 'h-[80%] pb-1 sm:pb-2 px-1 sm:px-2'
				} pt-2 object-contain rounded-t-md flex justify-center cursor-pointer bg-white`}
				onClick={() => onTabClick(4)}
			/>
		</div>
	);
};

export default TabControls;
