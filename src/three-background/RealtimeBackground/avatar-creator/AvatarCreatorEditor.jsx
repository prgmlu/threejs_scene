import React, { Component } from 'react';
import * as THREE from 'three'
import './AvatarCreatorEditor.css'
import {
    maleOutfits,
    femaleHair,
    femaleShirts,
    femalePants,
    femaleOutfits
} from './avatarsData';
import {predeterminedOutfitsNoHair} from './predeterminedOutfits';
import {setMeshTextureImage,dressUpFromString, getOutfitStringFromModel} from '../../../three-controls/OutfitTranslator';

import { USE_OLD_CHARACTER_MODEL } from './CustomizationConstants';

const maleModelImg = 'https://cdn.obsess-vr.com/maleModel%20.png';
const femaleModelImg = 'https://cdn.obsess-vr.com/femaleModel%20.png';

let HAIR_MESHES_COUNT = 3;



let HAIR_MESHES_NAMES = USE_OLD_CHARACTER_MODEL? ['Hair1', 'Hair2', 'Hair3'] : ['Hair2', 'Hair3', 'hair4']

let SHIRT_MESH_COUNT = 2;
let PANTS_MESH_COUNT = 2;


class AvatarCreatorEditor extends Component {
    constructor(props) {
        super(props);
        
        this.maleOutfits = maleOutfits;
        this.femaleOutfits = femaleOutfits;
        this.currentScene = this.props.currentScene;
        this.currentAvatar = {};

        this.localAvatarOutfitStringRef = props.localAvatarOutfitStringRef;

        this.props.currentAvatar && this.props.currentAvatar.traverse((i)=>{
            i.frustumCulled=false;
        })
    }
    state = {
        activeTab : 3,
        bodyType : 'male',
    }

    onTabClick = (e) => {
        this.setState({activeTab: e.target.id});
    }

    setBodyType = (e) => {
        this.setState({bodyType: e.target.id});
    }
    

    setOutfit = (e) => {

        let string = predeterminedOutfitsNoHair[e.target.id];
        dressUpFromString(this.props.currentAvatar, string);
        
        this.localAvatarOutfitStringRef.current = string;
    }


    setHair = (e) => {
        

        
        let selectedItem = femaleHair.filter((hair) => {return hair.name == e.target.id})[0];
        
            
            for (let i = 0; i < HAIR_MESHES_COUNT; i++) {
                this.props.currentAvatar.getChildByName( HAIR_MESHES_NAMES[i] ).visible = false;
            }
            
            let hairNumber = selectedItem.name[selectedItem.name.length-1];

            let hair = this.props.currentAvatar.getChildByName( HAIR_MESHES_NAMES[hairNumber-1] )

            hair.visible = true;
            
            setMeshTextureImage(hair, selectedItem.textureImage);
            let hairColor = 'Brown';
            if(selectedItem.textureImage.includes('Red')) hairColor = 'Red';
            if(selectedItem.textureImage.includes('Blonde')) hairColor = 'Blonde';

            let string = getOutfitStringFromModel(this.props.currentAvatar,hairColor);
            this.localAvatarOutfitStringRef.current = string;
            
    }
    setShirt = (e) => {

        let selectedItem = femaleShirts.filter((shirt) => {return shirt.name == e.target.id})[0];




            for (let i = 1; i <= SHIRT_MESH_COUNT; i++) {
                if(i==1) this.props.currentAvatar.getChildByName( `Shirt` ).visible = false;
                else
                    this.props.currentAvatar.getChildByName( `Shirt${i}` ).visible = false;
            }
            
            let shirtNumber = selectedItem.name[selectedItem.name.length-1];
            let shirt = this.props.currentAvatar.getChildByName( `Shirt${shirtNumber}` )
            shirt.visible = true;

            setMeshTextureImage(shirt, selectedItem.textureImage);

    }
    setPants = (e) => {
        let selectedItem = femalePants.filter((pants) => {return pants.name == e.target.id})[0];



            for (let i = 1; i <= PANTS_MESH_COUNT; i++) {
                if(i==1) this.props.currentAvatar.getChildByName( `Pants` ).visible = false;
                else
                    this.props.currentAvatar.getChildByName( `Pants${i}` ).visible = false;
            }
            
            let pantsNumber = selectedItem.name[selectedItem.name.length-1];
            let pants = this.props.currentAvatar.getChildByName( `Pants${pantsNumber}` )
            pants.visible = true;

            setMeshTextureImage(pants, selectedItem.textureImage);


    }

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
                    <div id='3' className={this.state.activeTab==3? 'activeTab' : 'inactiveTab'} onClick={this.onTabClick}>
                        <p id='3'>Outfit</p>
                    </div>
                    <div id='4' className={this.state.activeTab==4? 'activeTab' : 'inactiveTab'} onClick={this.onTabClick}>
                        <p id='4'>Hair</p>
                    </div>

                    {/* <div id='5' className={this.state.activeTab==5? 'activeTab' : 'inactiveTab'} onClick={this.onTabClick}>
                        <p id='5'>Shirts</p>
                    </div>
                    
                    <div id='6' className={this.state.activeTab==6? 'activeTab' : 'inactiveTab'} onClick={this.onTabClick}>
                        <p id='6'>Pants</p>
                    </div> */}

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
                        {this.femaleOutfits.map((outfit, index) => {
                            return <img key={index} id={outfit.name} src={outfit.displayImage} className={outfit.type} onClick={this.setOutfit}/>
                        })}
                    </div>}

                    {this.state.activeTab==4&&<div className='hairEditor'>

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