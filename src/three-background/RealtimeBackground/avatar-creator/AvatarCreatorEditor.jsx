import React, { Component } from 'react';
import * as THREE from 'three'
import './AvatarCreatorEditor.css'

const maleModelImg = 'https://cdn.obsess-vr.com/maleModel%20.png';
const femaleModelImg = 'https://cdn.obsess-vr.com/femaleModel%20.png';

let HAIR_MESHES_COUNT = 3;
let SHIRT_MESH_COUNT = 2;
let PANTS_MESH_COUNT = 2;

let maleOutfits = [
    {
        "type": "Pants",
        "name": "Pants_blue",
        "displayImage": "https://cdn.obsess-vr.com/realtime3d/static/avatar/outfit/male/display/Pants_blue.png",
        "textureImage": "https://cdn.obsess-vr.com/realtime3d/static/avatar/outfit/male/display/Pants_blue.png",
    },
    {
        "type": "Pants",
        "name": "Pants_grey",
        "displayImage": "https://cdn.obsess-vr.com/realtime3d/static/avatar/outfit/male/display/Pants_grey.png",
        "textureImage": "https://cdn.obsess-vr.com/realtime3d/static/avatar/outfit/male/display/Pants_grey.png",
    },
    {
        "type": "Pants",
        "name": "Pants_white",
        "displayImage": "https://cdn.obsess-vr.com/realtime3d/static/avatar/outfit/male/display/Pants_white.png",
        "textureImage": "https://cdn.obsess-vr.com/realtime3d/static/avatar/outfit/male/display/Pants_white.png",
    },
    {
        "type": "Shirt",
        "name": "Shirt_green",
        "displayImage": "https://cdn.obsess-vr.com/realtime3d/static/avatar/outfit/male/display/Shirt_green.png",
        "textureImage": "https://cdn.obsess-vr.com/realtime3d/static/avatar/outfit/male/display/Shirt_green.png",
    },
    {
        "type": "Shirt",
        "name": "Shirt_red",
        "displayImage": "https://cdn.obsess-vr.com/realtime3d/static/avatar/outfit/male/display/Shirt_red.png",
        "textureImage": "https://cdn.obsess-vr.com/realtime3d/static/avatar/outfit/male/display/Shirt_red.png",
    },
    {
        "type": "Shirt",
        "name": "Shirt_white",
        "displayImage": "https://cdn.obsess-vr.com/realtime3d/static/avatar/outfit/male/display/Shirt_white.png",
        "textureImage": "https://cdn.obsess-vr.com/realtime3d/static/avatar/outfit/male/display/Shirt_white.png",
    }
]

let femaleHair = [
    {
        "name":"BlondeHair1",
        "displayImage":"https://cdn.obsess-vr.com/realtime3d/hair/0.jpg",
        "textureImage":"https://cdn.obsess-vr.com/realtime3d/hair/Hair1Blonde_D.png",
    }
    ,
    {
        "name":"BrownHair1",
        "displayImage":"https://cdn.obsess-vr.com/realtime3d/hair/1.jpg",
        "textureImage":"https://cdn.obsess-vr.com/realtime3d/hair/Hair1Brown_D.png",
    }
    ,
    {
        "name":"RedHair1",
        "displayImage":"https://cdn.obsess-vr.com/realtime3d/hair/2.jpg",
        "textureImage":"https://cdn.obsess-vr.com/realtime3d/hair/Hair1Red_D.png",
    }
    ,
    {
        "name":"BlondeHair2",
        "displayImage":"https://cdn.obsess-vr.com/realtime3d/hair/3.jpg",
        "textureImage":"https://cdn.obsess-vr.com/realtime3d/hair/Hair2Blonde_D.png",
    }
    ,
    {
        "name":"BrownHair2",
        "displayImage":"https://cdn.obsess-vr.com/realtime3d/hair/4.jpg",
        "textureImage":"https://cdn.obsess-vr.com/realtime3d/hair/Hair2Brown_D.png",
    }
    ,
    {
        "name":"RedHair2",
        "displayImage":"https://cdn.obsess-vr.com/realtime3d/hair/5.jpg",
        "textureImage":"https://cdn.obsess-vr.com/realtime3d/hair/Hair2Red_D.png",
    }
    ,
    {
        "name":"BlondeHair3",
        "displayImage":"https://cdn.obsess-vr.com/realtime3d/hair/6.jpg",
        "textureImage":"https://cdn.obsess-vr.com/realtime3d/hair/Hair3Blonde_D.png",
    }
    ,
    {
        "name":"BrownHair3",
        "displayImage":"https://cdn.obsess-vr.com/realtime3d/hair/8.jpg",
        "textureImage":"https://cdn.obsess-vr.com/realtime3d/hair/Hair3Brown_D.png",
    }
    ,
    {
        "name":"RedHair3",
        "displayImage":"https://cdn.obsess-vr.com/realtime3d/hair/7.jpg",
        "textureImage":"https://cdn.obsess-vr.com/realtime3d/hair/Hair3Red_D.png",
    }
    ,

]
let femaleShirts = [
    {
        "name":"BlackShirt2",
        "displayImage":"https://cdn.obsess-vr.com/realtime3d/1.jpg",
        "textureImage":"https://cdn.obsess-vr.com/realtime3d/Shirt2Black_D.png",
    },
    {
        "name":"PinkShirt2",
        "displayImage":"https://cdn.obsess-vr.com/realtime3d/2.jpg",
        "textureImage":"https://cdn.obsess-vr.com/realtime3d/Shirt2Pink_D.png",
    },
    {
        "name":"WhiteShirt2",
        "displayImage":"https://cdn.obsess-vr.com/realtime3d/0.jpg",
        "textureImage":"https://cdn.obsess-vr.com/realtime3d/Shirt2White_D.png",
    },
]

let femalePants = [
    {
        "name":"BlackShirt2",
        "displayImage":"https://cdn.obsess-vr.com/realtime3d/pants/0.jpg",
        "textureImage":"https://cdn.obsess-vr.com/realtime3d/Pants2Black_D.png",
    },
    {
        "name":"GreyPants2",
        "displayImage":"https://cdn.obsess-vr.com/realtime3d/pants/2.jpg",
        "textureImage":"https://cdn.obsess-vr.com/realtime3d/Pants2Grey_D.png",
    },
    {
        "name":"BluePants2",
        "displayImage":"https://cdn.obsess-vr.com/realtime3d/pants/1.jpg",
        "textureImage":"https://cdn.obsess-vr.com/realtime3d/Pants2Blue_D.png",
    },
]

// window.model.getChildByName('Hair1').visible=false;window.model.getChildByName('Hair2').visible=false;

let setHairTextureFromImage = (hair, imageUrl) => {
    hair.mat
    let textureLoader = new THREE.ImageBitmapLoader();
    textureLoader.load ( imageUrl, (imageBitmap) => {
        const texture = new THREE.CanvasTexture( imageBitmap );
        hair.material.map = texture;
        hair.material.needsUpdate = true
     } );
}

window.setHairTextureFromImage = setHairTextureFromImage;

class AvatarCreatorEditor extends Component {
    constructor(props) {
        super(props);
        
        this.maleOutfits = maleOutfits;
        this.currentScene = this.props.currentScene;
        this.currentAvatar = {};

        this.props.currentAvatar && this.props.currentAvatar.traverse((i)=>{
            i.frustumCulled=false;
        })
    }
    state = {
        activeTab : 4,
        bodyType : 'male',
    }

    onTabClick = (e) => {
        this.setState({activeTab: e.target.id});
    }

    setBodyType = (e) => {
        this.setState({bodyType: e.target.id});
    }
    setOutfit = (e) => {
        let selectedItem = this.maleOutfits.filter((outfit) => {return outfit.name == e.target.id})[0];
        this.textureLoader = new THREE.ImageBitmapLoader();
        this.textureLoader.load ( selectedItem.textureImage, (imageBitmap) => {
            const texture = new THREE.CanvasTexture( imageBitmap );
            this.props.currentAvatar.children[0].getObjectByName( e.target.className ).material.map = texture;
            this.props.currentAvatar.children[0].getObjectByName( e.target.className ).material.needsUpdate = true
         } );
    }


    setHair = (e) => {
        
        
        let selectedItem = femaleHair.filter((hair) => {return hair.name == e.target.id})[0];
        
        if(selectedItem.name.includes('Red')) window.hairColor = 'Red';
        if(selectedItem.name.includes('Blonde')) window.hairColor = 'blonde';
        if(selectedItem.name.includes('Brown')) window.hairColor = 'brown';
        
        let textureLoader = new THREE.ImageBitmapLoader();
        textureLoader.load ( selectedItem.textureImage, (imageBitmap) => {
            const texture = new THREE.CanvasTexture( imageBitmap );
            
            for (let i = 1; i <= HAIR_MESHES_COUNT; i++) {
                this.props.currentAvatar.getChildByName( `Hair${i}` ).visible = false;
            }
            
            let hairNumber = selectedItem.name[selectedItem.name.length-1];
            let hair = this.props.currentAvatar.getChildByName( `Hair${hairNumber}` )
            hair.visible = true;
            
            hair.material.map = texture;
            hair.material.needsUpdate = true;
            
        } );
        window.outfitStringNeesUpdate = true;
    }
    setShirt = (e) => {

        let selectedItem = femaleShirts.filter((shirt) => {return shirt.name == e.target.id})[0];

        if(selectedItem.name.includes('Pink')) window.shirtColor = 'pink';
        if(selectedItem.name.includes('Black')) window.shirtColor = 'black';
        if(selectedItem.name.includes('White')) window.shirtColor = 'white';

        let textureLoader = new THREE.ImageBitmapLoader();
        textureLoader.load ( selectedItem.textureImage, (imageBitmap) => {
            const texture = new THREE.CanvasTexture( imageBitmap );

            for (let i = 1; i <= SHIRT_MESH_COUNT; i++) {
                if(i==1) this.props.currentAvatar.getChildByName( `Shirt` ).visible = false;
                else
                    this.props.currentAvatar.getChildByName( `Shirt${i}` ).visible = false;
            }
            
            let shirtNumber = selectedItem.name[selectedItem.name.length-1];
            let shirt = this.props.currentAvatar.getChildByName( `Shirt${shirtNumber}` )
            shirt.visible = true;

            shirt.material.map = texture;
            shirt.material.needsUpdate = true;

         } );

        window.outfitStringNeesUpdate = true;

    }
    setPants = (e) => {
        let selectedItem = femalePants.filter((pants) => {return pants.name == e.target.id})[0];
        
        if(selectedItem.name.includes('Grey')) window.pantsColor = 'grey';
        if(selectedItem.name.includes('Black')) window.pantsColor = 'black';
        if(selectedItem.name.includes('Blue')) window.pantsColor = 'blue';

        let textureLoader = new THREE.ImageBitmapLoader();
        textureLoader.load ( selectedItem.textureImage, (imageBitmap) => {
            const texture = new THREE.CanvasTexture( imageBitmap );

            for (let i = 1; i <= PANTS_MESH_COUNT; i++) {
                if(i==1) this.props.currentAvatar.getChildByName( `Pants` ).visible = false;
                else
                    this.props.currentAvatar.getChildByName( `Pants${i}` ).visible = false;
            }
            
            let pantsNumber = selectedItem.name[selectedItem.name.length-1];
            let pants = this.props.currentAvatar.getChildByName( `Pants${pantsNumber}` )
            pants.visible = true;

            pants.material.map = texture;
            pants.material.needsUpdate = true;

         } );
        window.outfitStringNeesUpdate = true;

    }
    // setHair = (e) => {
    //     let selectedItem = femaleHair.filter((hair) => {return hair.name == e.target.id})[0];
    //     let textureLoader = new THREE.ImageBitmapLoader();
    //     textureLoader.load ( selectedItem.textureImage, (imageBitmap) => {
    //         const texture = new THREE.CanvasTexture( imageBitmap );

    //         for (let i = 1; i <= HAIR_MESHES_COUNT; i++) {
    //             this.props.currentAvatar.getChildByName( `Hair${i}` ).visible = false;
    //         }
            
    //         let hairNumber = selectedItem.name[selectedItem.name.length-1];
    //         let hair = this.props.currentAvatar.getChildByName( `Hair${hairNumber}` )
    //         hair.visible = true;

    //         hair.material.map = texture;
    //         hair.material.needsUpdate = true;

    //      } );
    // }

    render() {
        return (
            <div className='avatarCreatorEditor'>

                <div className="settings">
                    {/* <div id='1' className={this.state.activeTab==1? 'activeTab' : 'inactiveTab'} onClick={this.onTabClick}>
                        <p id='1'>Body type</p>
                    </div> */}
                    {/* <div id='2' className={this.state.activeTab==2? 'activeTab' : 'inactiveTab'} onClick={this.onTabClick}>
                        <p id='2'>Skin tone</p>
                    </div> */}
                    {/* <div id='3' className={this.state.activeTab==3? 'activeTab' : 'inactiveTab'} onClick={this.onTabClick}>
                        <p id='3'>Outfit</p>
                    </div> */}
                    <div id='4' className={this.state.activeTab==4? 'activeTab' : 'inactiveTab'} onClick={this.onTabClick}>
                        <p id='4'>Hair</p>
                    </div>

                    <div id='5' className={this.state.activeTab==5? 'activeTab' : 'inactiveTab'} onClick={this.onTabClick}>
                        <p id='5'>Shirts</p>
                    </div>
                    
                    <div id='6' className={this.state.activeTab==6? 'activeTab' : 'inactiveTab'} onClick={this.onTabClick}>
                        <p id='6'>Pants</p>
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
                        {this.maleOutfits.map((outfit, index) => {
                            return <img key={index} id={outfit.name} src={outfit.displayImage} className={outfit.type} onClick={this.setOutfit}/>
                        })}
                    </div>}

                    {this.state.activeTab==4&&<div className='outfitEditor'>

                        {femaleHair.map((outfit, index) => {
                            return <img key={index} id={outfit.name} src={outfit.displayImage} className={outfit.type} onClick={this.setHair}/>
                        })}
                    </div>}
                    {this.state.activeTab==5&&<div className='outfitEditor'>

                        {femaleShirts.map((outfit, index) => {
                            return <img key={index} id={outfit.name} src={outfit.displayImage} className={outfit.type} onClick={this.setShirt}/>
                        })}
                    </div>}
                    {this.state.activeTab==6&&<div className='outfitEditor'>

                        {femalePants.map((outfit, index) => {
                            return <img key={index} id={outfit.name} src={outfit.displayImage} className={outfit.type} onClick={this.setPants}/>
                        })}
                    </div>}
                </div>
                                 
            </div>
        );
    }
}


export default AvatarCreatorEditor;