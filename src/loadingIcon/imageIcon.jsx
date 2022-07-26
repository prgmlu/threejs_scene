import React from 'react';
import './imageIcon.scss';

const LoadingIcon = ({ src }) => {
	return (
		<div className={'loading-icon-container'}>
			<img src={src} />
		</div>
	);
};

export default LoadingIcon;
