import React from 'react';
import ImageIcon from './imageIcon';
import LoadingIconDefault from './default';

const LoadingIcon = ({ src }) => {
	return <>{src ? <ImageIcon src={src} /> : <LoadingIconDefault />}</>;
};

export default LoadingIcon;
