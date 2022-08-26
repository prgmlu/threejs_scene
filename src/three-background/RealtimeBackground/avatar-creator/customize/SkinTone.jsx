import React from 'react';
import check from '../../static/avatar/menus/check.png';

const SkinTone = ({ color, x, y, selectedIndex, setSelectedIndex }) => {
	return (
		<div className="w-fit h-fit relative">
			{x === selectedIndex.x && y === selectedIndex.y && (
				<span className="absolute top-0 right-0 w-3 h-3 object-contain">
					<img src={check} alt="o" />
				</span>
			)}
			<button
				onClick={() => setSelectedIndex({ x: x, y: y })}
				style={{ backgroundColor: color }}
				className={`w-10 sm:w-12 h-10_ sm:h-12 rounded-full cursor-pointer border-2 ${
					x === selectedIndex.x &&
					y === selectedIndex.y &&
					'border-[#FF9F9F]'
				}`}
			></button>
		</div>
	);
};

export default SkinTone;
