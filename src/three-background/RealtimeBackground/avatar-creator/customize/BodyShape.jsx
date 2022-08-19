import React from 'react';
import { useState } from 'react';
import check from '../../static/avatar/menus/check.png';
import ColorTone from '../ColorTone';

const BodyShape = () => {
	const [selectedShape, setSelectedShape] = useState(1);

	return (
		<div className="flex flex-col gap-2">
			<div className="font-sourceSansProSemibold text-xl">Body Shape</div>
			<div className="flex gap-x-4">
				<button
					onClick={() => setSelectedShape(0)}
					className={`w-24 shadow-md ${
						selectedShape === 0
							? 'bg-white border-[0.25px] border-green-400'
							: 'bg-white/50'
					} text-sm font-sourceSansProSemibold rounded px-3 py-1.5 relative`}
				>
					Unspecified
					{selectedShape === 0 && (
						<span className="absolute -top-1.5 -right-1.5 w-4 h-4 object-contain">
							<img src={check} alt="o" />
						</span>
					)}
				</button>
				<button
					onClick={() => setSelectedShape(1)}
					className={`w-24 shadow-md ${
						selectedShape === 1
							? 'bg-white border-[0.25px] border-green-400'
							: 'bg-white/50'
					} text-sm font-sourceSansProSemibold rounded px-3 py-1.5 relative`}
				>
					Feminine
					{selectedShape === 1 && (
						<span className="absolute -top-1.5 -right-1.5 w-4 h-4 object-contain">
							<img src={check} alt="o" />
						</span>
					)}
				</button>
				<button
					onClick={() => setSelectedShape(2)}
					className={`w-24 shadow-md ${
						selectedShape === 2
							? 'bg-white border-[0.25px] border-green-400'
							: 'bg-white/50'
					} text-sm font-sourceSansProSemibold rounded px-3 py-1.5 relative`}
				>
					Masculine
					{selectedShape === 2 && (
						<span className="absolute -top-1.5 -right-1.5 w-4 h-4 object-contain">
							<img src={check} alt="o" />
						</span>
					)}
				</button>
			</div>
			<ColorTone title="Skin tone" />
		</div>
	);
};

export default BodyShape;
