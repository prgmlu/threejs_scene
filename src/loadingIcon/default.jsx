import React from 'react';
import './default.scss';

const LoadingIconDefault = () => (
	<div align="center" className="cssload-fond" id="loadingIcon">
		<div className="cssload-container-general">
			<div className="cssload-internal">
				<div className="cssload-ballcolor cssload-ball_1" />
			</div>
			<div className="cssload-internal">
				<div className="cssload-ballcolor cssload-ball_2" />
			</div>
			<div className="cssload-internal">
				<div className="cssload-ballcolor cssload-ball_3" />
			</div>
			<div className="cssload-internal">
				<div className="cssload-ballcolor cssload-ball_4" />
			</div>
		</div>
	</div>
);

export default LoadingIconDefault;
