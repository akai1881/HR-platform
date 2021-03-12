import React from 'react';

function FuseSplashScreen() {
	return (
		<div id="fuse-splash-screen">
			<div className="center">
				<div className="logo">
					<img width="200" src="assets/images/logos/main_logo.svg" alt="logo" />
				</div>
				<div className="spinner-wrapper">
					<div className="spinner">
						<div className="inner">
							<div className="atom-spinner">
								<div className="spinner-inner">
									<div className="spinner-line"></div>
									<div className="spinner-line"></div>
									<div className="spinner-line"></div>
									<div className="spinner-circle">&#9679;</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default React.memo(FuseSplashScreen);
