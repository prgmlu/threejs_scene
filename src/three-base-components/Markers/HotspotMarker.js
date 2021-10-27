import InteractionObject from '../InteractionObject';
import SVGSpriteComponent from '../../three-svg/SVGSpriteComponent';


export default class HotspotMarker extends InteractionObject {
    constructor({userData, UIConfig}) {
        super();
        this.sceneObject.name = 'marker';
        this.hotspot_type = 'hotspot_marker'; //type of marker
        this.userData = userData; //stores custom user data
        this.UIConfig = UIConfig; //could be used for modals



        //Fetch Icon SVG from CDN
        this.fetchSVGIcon()
            .then(svgString=>{
                this.svgSpriteComponent.setSVGString(svgString);
            });

        this.svgSpriteComponent = null;
        this.isFlatBackground = false;
    }




    fetchSVGIcon = async()=>{
        let svgFile = sessionStorage.getItem('hotspot-circle-icon');

        if(svgFile) return svgFile;
        else{
            const svgUrl = 'https://cdn.obsess-vr.com/product-hotspot-icon-circle.svg';
            return fetch(svgUrl)
                .then((response) => {
                    if (response.status === 200) return response.text();
                    throw new Error('svg load error!');
                })
                .then((res) => {
                    sessionStorage.setItem('hotspot-circle-icon', res);
                    return res;
                })
                .catch((error) => Promise.reject(error));
        }
    }

    addToScene = (scene) => {
        this.scene = scene;
        scene.add(this.sceneObject);

        this.isFlatBackground = this.scene.children.some((child) => child.name === 'flatBackground');
        this.svgSpriteComponent = new SVGSpriteComponent(this.visualTransform);
        this.svgSpriteComponent.name='sprite';
        this.attachComponent(this.svgSpriteComponent);
    }


    setTransform = (colliderTransform, visualTransform) => {
        // console.log('--setTransform', {this:this});
        super.setTransform(colliderTransform, visualTransform);

        const { x, y, z } = this.sceneObject.position;
        this.setPosition(x, y, z);
    }

    // setPosition=(x, y, z)=>{
    //     super.setPosition(x, y, z);
    // }

    setScale = (scale = 0.45) => {
        this.sceneObject.scale.x = scale;
        this.sceneObject.scale.y = scale;
        this.sceneObject.scale.z = scale;
    }



    // dispose() {
    //     this.scene.remove(this.visualObject);
    //     this.scene.remove(this.sceneObject);
    //     this.scene.remove(this.svgSpriteComponent);
    //     super.dispose();
    //
    //     this.setVisualObject(null);
    //     this.sceneObject = null;
    // }
}
