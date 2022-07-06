import React, { Component } from 'react';
import * as THREE from 'three'
import './AvatarCreatorEditor.css'

const maleModelImg = 'https://cdn.obsess-vr.com/maleModel%20.png';
const femaleModelImg = 'https://cdn.obsess-vr.com/femaleModel%20.png';


let displayImgs = [
    {
        "type": "Pants",
        "name": "Pants_blue",
        "src": "https://cdn.obsess-vr.com/realtime3d/static/avatar/outfit/male/display/Pants_blue.png"
    },
    {
        "type": "Pants",
        "name": "Pants_grey",
        "src": "https://cdn.obsess-vr.com/realtime3d/static/avatar/outfit/male/display/Pants_grey.png"
    },
    {
        "type": "Pants",
        "name": "Pants_white",
        "src": "https://cdn.obsess-vr.com/realtime3d/static/avatar/outfit/male/display/Pants_white.png"
    },
    {
        "type": "Shirt",
        "name": "Shirt_green",
        "src": "https://cdn.obsess-vr.com/realtime3d/static/avatar/outfit/male/display/Shirt_green.png"
    },
    {
        "type": "Shirt",
        "name": "Shirt_red",
        "src": "https://cdn.obsess-vr.com/realtime3d/static/avatar/outfit/male/display/Shirt_red.png"
    },
    {
        "type": "Shirt",
        "name": "Shirt_white",
        "src": "https://cdn.obsess-vr.com/realtime3d/static/avatar/outfit/male/display/Shirt_white.png"
    }
]

let textureImgs = [
    {
        "type": "Shoes",
        "name": "Shoes_brown",
        "src": "https://cdn.obsess-vr.com/realtime3d/static/avatar/outfit/male/textures/Shoes_brown.png"
    },
    {
        "type": "Pants",
        "name": "Pants_blue",
        "src": "https://cdn.obsess-vr.com/realtime3d/static/avatar/outfit/male/textures/Pants_blue.png"
    },
    {
        "type": "Pants",
        "name": "Pants_grey",
        "src": "https://cdn.obsess-vr.com/realtime3d/static/avatar/outfit/male/textures/Pants_grey.png"
    },
    {
        "type": "Pants",
        "name": "Pants_white",
        "src": "https://cdn.obsess-vr.com/realtime3d/static/avatar/outfit/male/textures/Pants_white.png"
    },
    {
        "type": "Shirt",
        "name": "Shirt_green",
        "src": "https://cdn.obsess-vr.com/realtime3d/static/avatar/outfit/male/textures/Shirt_green.png"
    },
    {
        "type": "Shirt",
        "name": "Shirt_red",
        "src": "https://cdn.obsess-vr.com/realtime3d/static/avatar/outfit/male/textures/Shirt_red.png"
    },
    {
        "type": "Shirt",
        "name": "Shirt_white",
        "src": "https://cdn.obsess-vr.com/realtime3d/static/avatar/outfit/male/textures/Shirt_white.png"
    }
]


class AvatarCreatorEditor extends Component {
    constructor(props) {
        super(props);
        this.textureLoader = new THREE.TextureLoader;
        this.maleOutfits = {
            textures : textureImgs,
            display : displayImgs,
        }
        this.currentScene = this.props.currentScene;
        this.currentAvatar = {};
    }
    state = {
        activeTab : 1,
        bodyType : 'male',
    }

    onTabClick = (e) => {
        this.setState({activeTab: e.target.id});
    }

    setBodyType = (e) => {
        this.setState({bodyType: e.target.id});
    }
    setOutfit = (e) => {
        let selectedItem = this.maleOutfits.textures.filter((texture) => {return texture.name == e.target.id})[0];
        this.textureLoader = new THREE.ImageBitmapLoader();
        this.textureLoader.load ( selectedItem.src, (imageBitmap) => {
            const texture = new THREE.CanvasTexture( imageBitmap );
            this.props.currentAvatar.children[0].getObjectByName( e.target.className ).material.map = texture;
            this.props.currentAvatar.children[0].getObjectByName( e.target.className ).material.needsUpdate = true
         } );
    }

    // componentDidMount() {  

    // }

    render() {
        return (
            <div className='avatarCreatorEditor'>

                <div className="settings">
                    <div id='1' className={this.state.activeTab==1? 'activeTab' : 'inactiveTab'} onClick={this.onTabClick}>
                        <p id='1'>Body type</p>
                    </div>
                    <div id='2' className={this.state.activeTab==2? 'activeTab' : 'inactiveTab'} onClick={this.onTabClick}>
                        <p id='2'>Skin tone</p>
                    </div>
                    <div id='3' className={this.state.activeTab==3? 'activeTab' : 'inactiveTab'} onClick={this.onTabClick}>
                        <p id='3'>Outfit</p>
                    </div>
                </div>

                <div className="content">
                    {this.state.activeTab==1&&<div className='bodyTypeEditor'>
                        <img
                            src={maleModelImg}
                            id='male'
                            className={this.state.bodyType=='male' ? 'selectedImg' : 'notSelectedImg'}
                            onClick={this.setBodyType}
                        />
                        <img
                            src={femaleModelImg}
                            id='female'
                            className={this.state.bodyType=='female' ? 'selectedImg' : 'notSelectedImg'}
                            onClick={this.setBodyType}
                        />
                    </div>}

                    {this.state.activeTab==2&&<div className='skinToneEditor'>
                    skinToneEditor
                    </div>}

                    {this.state.activeTab==3&&<div className='outfitEditor'>
                        {this.maleOutfits.display.map((outfit, index) => {
                            return <img key={index} id={outfit.name} src={outfit.src} className={outfit.type} onClick={this.setOutfit}/>
                        })}
                    </div>}
                </div>
                                 
            </div>
        );
    }
}


export default AvatarCreatorEditor;