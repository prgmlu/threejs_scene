import React from 'react';
import './imageIcon.scss';

const LoadingIcon = ({ src }) => {
	return (
		<div className={'loading-icon-container'}>
			<img className={'loading-image'} src={src} />;
		</div>
	);
};

export default LoadingIcon;
