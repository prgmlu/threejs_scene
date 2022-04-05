import InteractionObject from '../../three-base-components/InteractionObject';
import SVGSpriteComponent from '../../three-svg/SVGSpriteComponent';

export default class HotspotMarker extends InteractionObject {
	constructor({
		imageURL,
		iconConfig = {},
		userData,
		UIConfig,
		primaryColor = '#000000',
		secondaryColor = '#00000050',
		arrowColor = null,
		onClick = () => {},
	}) {
		super();
		this.sceneObject.name = 'marker';
		this.hotspot_type = 'hotspot_marker'; //type of marker
		this.userData = userData; //stores custom user data
		this.UIConfig = UIConfig; //could be used for modals

		this.imageURL = imageURL;
		this.isFlatBackground = false;

		this.onClickCallBack = onClick;

		this.primaryColor = primaryColor;
		this.secondaryColor = secondaryColor;

		//SVG Icon
		this.svgSpriteComponent = new SVGSpriteComponent(iconConfig);

		this.fetchSVGIcon().then((svgString) => {
			if (userData.props.sprite_rotation_degree) {
				svgString = svgString.replace(
					'rotate(',
					'rotate(' + userData.props.sprite_rotation_degree,
				);
			}
			// if (userData.type === 'NavMarker'){
			//     //change arrow color
			//     svgString = svgString.replace("path fill='#FFFFFF","path fill='"+this.arrowColor)
			//     svgString = svgString.replace(/\<path/g,"<path opacity='.5'")
			//     svgString = svgString.replace(/\<circle/g,"<circle opacity='.5'")
			//     // alert(svgString)
			// }
			//
			if (userData.type === 'HotspotMarker') {
				//change dot color
				svgString = svgString.replace('white', this.primaryColor);
				svgString = svgString.replace(/\<path/g, "<path opacity='1'");
				svgString = svgString.replace(
					/\<circle/g,
					"<circle opacity='1'",
				);
			}
			this.svgSpriteComponent.setSVGString(svgString);
		});
	}

	onClick = () => {
		if (this.onClickCallBack) {
			this.onClickCallBack();
		}
	};

	fetchSVGIcon = async () => {
		const fileData = this.imageURL
			? this.imageURL.split('/').pop().split('.')
			: false;
		if (fileData && fileData[1] !== 'svg')
			console.error('Improper hotspot image format. Must be svg');

		const fileName = fileData?.[0] || 'default';
		const iconName = `hotspot-${fileName}-icon`;
		const svgUrl =
			this.imageURL ||
			'https://cdn.obsess-vr.com/product-hotspot-icon-circle.svg';
		let svgFile = sessionStorage.getItem(iconName);

		if (svgFile) return svgFile;
		else {
			return fetch(svgUrl)
				.then((response) => {
					if (response.status === 200) return response.text();
					throw new Error('svg load error!');
				})
				.then((res) => {
					sessionStorage.setItem(iconName, res);
					return res;
				})
				.catch((error) => Promise.reject(error));
		}
	};

	addToScene = (scene) => {
		this.scene = scene;
		scene.add(this.sceneObject);
		this.isFlatBackground = this.scene.children.some(
			(child) => child.name === 'flatBackground',
		);

		this.attachComponent(this.svgSpriteComponent);
	};

	setTransform = (colliderTransform, visualTransform) => {
		super.setTransform(colliderTransform, visualTransform);

		const { x, y, z } = this.sceneObject.position;
		this.setPosition(x, y, z);
	};

	setScale = (scale = 0.45) => {
		this.sceneObject.scale.x = scale;
		this.sceneObject.scale.y = scale;
		this.sceneObject.scale.z = scale;
	};
}
