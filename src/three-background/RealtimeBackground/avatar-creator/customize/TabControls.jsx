import React from 'react';
import cloth from '../../static/avatar/menus/clothes.png';
import body from '../../static/avatar/menus/body.png';
import skin from '../../static/avatar/menus/skin.png';
import makeup from '../../static/avatar/menus/brush.png';

const TabControls = ({ activeTab, onTabClick }) => {
	return (
		<div className="w-full sm:w-[70%] md:w-[80%] h-fit sm:h-[12%] md:h-[13%] lg:h-[15%] flex items-start justify-center gap-3">
			<img
				src={body}
				alt="Body type"
				id="1"
				className={`${
					activeTab == 1
						? 'pt-2 pb-4 rounded-t-md'
						: 'pt-2 pb-2 rounded-md'
				} px-3 rounded-t-md flex justify-center cursor-pointer object-contain bg-white`}
				onClick={() => onTabClick(1)}
			/>
			<img
				src={skin}
				alt="Skin tone"
				id="2"
				className={`${
					activeTab == 2
						? 'pt-2 pb-4 rounded-t-md'
						: 'pt-2 pb-2.5 rounded-md'
				} px-3 rounded-t-md flex justify-center cursor-pointer object-contain bg-white`}
				onClick={() => onTabClick(2)}
			/>
			<img
				src={makeup}
				alt="Makeup"
				id="2"
				className={`${
					activeTab == 3
						? 'pt-2 pb-4 rounded-t-md'
						: 'pt-2 pb-2.5 rounded-md'
				} px-3 rounded-t-md flex justify-center cursor-pointer object-contain bg-white`}
				onClick={() => onTabClick(3)}
			/>
			<img
				src={cloth}
				alt="Outfit"
				id="3"
				className={`${
					activeTab == 4
						? 'pt-2 pb-4 rounded-t-md'
						: 'pt-2 pb-2 rounded-md'
				} px-3 rounded-t-md flex justify-center cursor-pointer object-contain bg-white`}
				onClick={() => onTabClick(4)}
			/>
		</div>
	);
};

export default TabControls;
