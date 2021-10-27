import * as THREE from 'three';
import InteractionObject from '../InteractionObject';



export default class ImageMarker extends InteractionObject {
    constructor({imageURL, renderOrder, scale, collider_transform, transform, userData, UIConfig}) {
        super();

        this.sceneObject.name = 'marker';
        this.hotspot_type = 'image_marker'; //type of marker
        this.isFlatBackground = false;
        this.scale = scale;
        this.renderOrder = renderOrder;
        this.userData = userData; //data keep any custom data provided by users
        this.UIConfig = UIConfig; //could be used for modals


        // init VisualObject
        this.setVisualObject(new THREE.Mesh(
            new THREE.PlaneGeometry(1, 1),
            new THREE.MeshBasicMaterial(),
        ));

        this.setImage(imageURL);
        this.setRenderOrder(renderOrder);

        //Set transforms
        if(collider_transform && transform) this.setTransform(collider_transform, transform);

    }

    setRenderOrder = (renderOrder)=> {
        this.visualObject.renderOrder = renderOrder;
        this.sceneObject.renderOrder = renderOrder;
    }


    setImage(imageURL) {
        if(!imageURL) return;

        const loader = new THREE.TextureLoader();
        loader.load(imageURL, (texture) => {
            const { image } = texture;
            const width = image.width / image.height;
            const height = 1;

            if (this.visualObject) {
                this.setNewGeometry(width, height, texture);
            }
        });
    }

    addToScene = (scene) => {
        this.scene = scene;
        this.camera = scene.children.find((child) => child.type === 'PerspectiveCamera');
        this.isFlatBackground = this.scene.children.some((child) => child.name === 'flatBackground');
        scene.add(this.sceneObject);
        scene.add(this.visualObject);
    }

    setTransform = (colliderTransform, visualTransform) => {
        super.setTransform(colliderTransform, visualTransform);
    }

    setScale = (scale = 1) => {
        this.sceneObject.scale.set(scale, scale, scale);
        this.visualObject.scale.set(scale, scale, scale);
    }

    lookAt = (position = this.camera.position) => {
        this.visualObject.lookAt(position);
        this.sceneObject.lookAt(position);
    }

    setPosition = (x, y, z) => {
        //super.setPosition(x, y, z);
        this.sceneObject.position.set(x, y, z);

        if (!this.isFlatBackground) {
            this.sceneObject.position.clampLength(10, 10);
            this.lookAt(this.camera.position);
        }

        this.visualObject.position.copy(this.sceneObject.position);
    };



    setNewGeometry(width, height, texture) {
        const geometry = new THREE.PlaneGeometry(width, height);
        const material = new THREE.MeshBasicMaterial({
            map: texture, transparent: true, depthTest: false,
        });

        this.visualObject.geometry = geometry;
        this.visualObject.material = material;

        this.sceneObject.geometry = new THREE.BoxGeometry(width, height, 0.001);
        this.setScale(this.scale);
    }





    dispose() {
        this.scene.remove(this.visualObject);
        this.scene.remove(this.sceneObject);
        super.dispose();

        this.setVisualObject(null);
        this.sceneObject = null;
    }
}
