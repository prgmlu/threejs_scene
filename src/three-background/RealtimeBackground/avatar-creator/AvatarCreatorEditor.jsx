import React, { Component } from 'react';
import * as THREE from 'three';
import TabControls from './customize/TabControls';
import Outfit from './customize/Outfit';
import BodyShape from './customize/BodyShape';
import Face from './customize/Face';
import Makeup from './customize/Makeup';
import { MobileOnlyView } from 'react-device-detect';

function importImgsFolder(r) {
	let images = [];
	r.keys().map((item) => {
		images.push({
			type: item.split('./')[1].split('_')[0],
			name: item.split('./')[1].split('.')[0],
			src: r(item).default,
		});
	});
	return images;
}

class AvatarCreatorEditor extends Component {
	constructor(props) {
		super(props);
		this.textureLoader = new THREE.TextureLoader();
		this.maleOutfits = {
			textures: importImgsFolder(
				require.context(
					'../static/avatar/outfit/male/textures',
					false,
					/\.(png)$/,
				),
			),
			display: [

				"https://cdn.obsess-vr.com/realtime3d/outfits/image (7).png",
				"https://cdn.obsess-vr.com/realtime3d/outfits/image (8).png",
				"https://cdn.obsess-vr.com/realtime3d/outfits/image (9).png",
				"https://cdn.obsess-vr.com/realtime3d/outfits/image (10).png",
				"https://cdn.obsess-vr.com/realtime3d/outfits/image (7).png",
				"https://cdn.obsess-vr.com/realtime3d/outfits/image (8).png",
				"https://cdn.obsess-vr.com/realtime3d/outfits/image (9).png",
				"https://cdn.obsess-vr.com/realtime3d/outfits/image (10).png",
			
			]
		};
		this.currentScene = props?.currentScene;
		this.currentAvatar = {};
	}
	state = {
		activeTab: 1,
		bodyType: 'male',
		selectedOutfit: -1,
	};

	onTabClick = (id) => {
		this.setState({ activeTab: id });
	};

	setBodyType = (e) => {
		this.setState({ bodyType: e.target.id });
	};

	setOutfit = (e, index) => {
		this.setState({ selectedOutfit: index }, () => {});

		let selectedItem = this.maleOutfits.textures.filter((texture) => {
			return texture.name == e.target.id;
		})[0];
		let selectedTexture = this.textureLoader.load(selectedItem.src);
		this.currentScene.children[0].children[0].getObjectByName(
			e.target.className,
		).material.map = selectedTexture;
		this.currentScene.children[0].children[0].getObjectByName(
			e.target.className,
		).material.needsUpdate = true;
	};

	handlePicker = (value) => {
		this.setState({
			color: value,
		});
	};

	handleClose = () => this.setState({ isPickerVisible: false });

	// componentDidMount() {

	// }

	render() {
		const { selectedOutfit, activeTab } = this.state;
		return (
			<div className="w-full sm:w-1/2 md:w-2/5 lg:w-[45%] h-1/2 sm:h-full flex flex-col justify-between sm:justify-start items-center sm:items-start relative">
				<TabControls
					activeTab={activeTab}
					onTabClick={this.onTabClick}
				/>
				<div className="w-[96%] sm:w-[70%] md:w-[80%] h-[87%] sm:h-[86%] md:h-[88%] lg:h-[80%] bg-white rounded-lg gap-x-2 pt-3 px-3">
					{activeTab == 1 && <BodyShape />}
					{activeTab == 2 && <Face />}
					{activeTab == 3 && <Makeup />}
					{activeTab == 4 && (
						<Outfit
							selectedOutfit={selectedOutfit}
							maleOutfits={this.maleOutfits}
							setOutfit={this.setOutfit}
						/>
					)}
				</div>
				{!MobileOnlyView && (
					<div className="w-[96%] sm:w-[70%] md:w-[80%] flex justify-center items-center py-3">
						<button className="w-fit h-fit self-center text-[#330D0D] px-7 py-0.5 text-sm border-[1px] border-[#330D0D] rounded-md">
							Save
						</button>
					</div>
				)}
			</div>
		);
	}
}

export default AvatarCreatorEditor;
