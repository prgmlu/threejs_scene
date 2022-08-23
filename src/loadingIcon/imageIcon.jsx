import React from 'react';
import './imageIcon.scss';

const LoadingIcon = ({ src }) => {
	return (
		<div className={'loading-icon-container'}>
			<img
				className={
					src.slice(-3) === 'gif' ? 'loading-gif' : 'loading-image'
				}
				src={src}
			/>
		</div>
	);
};

export default LoadingIcon;
