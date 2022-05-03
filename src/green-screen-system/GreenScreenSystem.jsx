import React, { Component } from 'react';
import GreenScreenedVid from './GreenScreenedVid.jsx';

const getFacePos = (face)=>{
    switch (face){
        case 'front':
            return {x:-5,y:0,z:0}
        case 'right':
            return {x:0,y:0,z:-5}
        case 'back':
            return {x:5,y:0,z:0}
        case 'top':
            return {x:0,y:5,z:0}

        // need to test these vals
        case 'left':
            return {x:0,y:0,z:5}
        case 'bottom':
            return {x:0,y:-5,z:0}

    }
}

const getFaceRot = (face)=>{
    switch (face){
        case 'front':
            return {x:0,y:-Math.PI/2,z:0}
        case 'right':
            return {x:0,y:-Math.PI,z:0}
        case 'back':
            return {x:0,y:Math.PI/2,z:0}
        case 'top':
            return {x:-Math.PI/2,y:0,z:-Math.PI/2}

        // need to test these vals
        case 'left':
            return {x:0,y:0,z:0}
        case 'bottom':
            return {x:Math.PI/2,y:0,z:Math.PI/2}

    }
}

const createVidDom = function (src) {
    var video = document.createElement('video');
    video.src = src;
    video.setAttribute('webkit-playsinline', '');
    video.crossOrigin = 'anonymous';
    video.setAttribute('playsinline', '');
    video.setAttribute('loop', 'loop');
    // video.setAttribute('autoplay', 'true');
    video.muted = true;
    return video;
  }
  
class GreenScreenSystem extends Component {
    constructor(props){
        super(props);
        // alert(props.roomId);
        this.scene = this.props.scene || this.props.sceneRef.current;
        this.srcs = this.props.srcs;
        this.similarity = this.props.similarity;
        this.smoothness = this.props.smoothness;
        this.spill = this.props.spill;
        this.keyColor = this.props.keyColor;
    }

    componentDidMount(){
        this.positions = [
            //front
            {x:-5,y:0,z:0},
            //right
            {x:0,y:0,z:-5},
            //back
            {x:5,y:0,z:0},
            //top
            {x:0,y:5,z:0},

            //need to test these vals
            //left
            {x:0,y:0,z:5},
            //bottom
            {x:0,y:-5,z:0}
        ]

        this.rotations = [
            {x:0,y:-Math.PI/2,z:0},
            {x:0,y:-Math.PI,z:0},
            {x:0,y:Math.PI/2,z:0},
            {x:-Math.PI/2,y:0,z:-Math.PI/2},

            //need to test these vals
            {x:0,y:0,z:0},
            {x:Math.PI/2,y:0,z:Math.PI/2},
        ]
        
        this.vids = this.srcs.map((src)=>{
            let face = Object.keys(src)[0];
            let vidSrc = src[face];
            if (vidSrc && (vidSrc!='') )
                return createVidDom(vidSrc)
            else return null;
        });

        this.loadedVidsFlags = [];

        this.loadedVidsFlags = this.srcs.map((src)=>{
            let face = Object.keys(src)[0];
            if(src[face]){
                return false
            }
            return true
        })

        this.meshes = this.vids.map((vid,indx)=>{
            if(vid){
                let faceName = Object.keys(this.srcs[indx])[0];
                let pos = getFacePos(faceName);
                let rot = getFaceRot(faceName);
                return GreenScreenedVid(vid, pos, rot,this.keyColor, this.similarity, this.smoothness, this.spill);
            }
            else{
                return null;
            }
        })
        
        this.vids.forEach((vid,indx)=>{
            if(vid){
                vid.addEventListener('loadeddata',()=>{
                    this.loadedVidsFlags[indx] = true;
                    // alert('loaded');
                    
                    //if it doesn't include false, means all are loaded
                    if(!this.loadedVidsFlags.includes(false)){
                        this.vids.forEach((vid,indx)=>{
                            if(vid){
                                
                                vid.play();
                                this.scene.add(this.meshes[indx]);
                            }
                        })
                    }
                })
            }
        })

    }

    componentWillUnmount(){

        this.meshes.forEach((mesh)=>{
            if(mesh){
                this.scene.remove(mesh);
                mesh.material.map=null;
                mesh.material.dispose();
                mesh.geometry.dispose();
            }
        })


        this.vids.forEach((domVid)=>{
            if(domVid){
                domVid.pause();
                // domVid.empty();     
                // domVid.load();     
                // delete domVid;
                domVid.remove()
            }
        })

    }

    render() {
        return (
            <div></div>
        );
    }
}

export default GreenScreenSystem;