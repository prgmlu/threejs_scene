import React, { Component } from 'react';
import * as THREE from 'three'
import { setUpEnvMap, createRenderer,createScene } from '../../threeHelpers';
import AvatarCreatorEditor from './AvatarCreatorEditor';
import './AvatarCreator.css'
import TextInput from './TextInput';

class AvatarCreator extends Component {
    constructor(props) {
        super(props);
        this.scene = createScene();
        this.renderer = createRenderer();
        this.renderer.setSize((window.innerWidth*.3528), (window.innerHeight*.6205));
		this.camera = new THREE.PerspectiveCamera(50, (window.innerWidth*.3528)/(window.innerHeight*.6205), 0.1, 1000);
        this.myRef = React.createRef();
        this.lastMPos = {x: 0, y: 0};
        this.canRotate = false;
        this.currentAvatar = props?.currentAvatar;
        this.saveAvatar = props?.saveAvatar;
        this.closeModal = props?.closeModal;
        this.avatarName = null;

        this.active = props.active;
    }

    _onAvatarNameChange = e => {
        this.setAvatarName(e.target.value);
        window.avatarName = e.target.value;
      }
    

      setAvatarName = (avatarName) => {
        
        this.setState({avatarName});
      }

    loadAvatar = () => {
        this.currentAvatar.position.set(0, -.9, -2.7);
        this.currentAvatar.rotation.set(0,0,0,'XYZ');

        this.scene.add(this.props.currentAvatar);
        this.scene.add(this.props.currentAvatar.boundingObj);
        
	}

    rotateAvatar = (e) => {
            if (!this.canRotate) return;
            //you can only calculate the distance if therer already was a mouse event
            if (e.touches && e.touches.length == 1) {
                if (typeof this.lastMPos.x != 'undefined') {
                    //calculate how far the mouse has moved
                    var deltaX = this.lastMPos.x - e.touches[0].clientX;
    
                    if (this.first) {
                        deltaX = 0;
                    }
                    this.first = false;
    
                    //rotate your object accordingly
                    this.currentAvatar.rotation.y -= deltaX * 0.03;
                }
    
                //save current mouse Position for next time
                this.lastMPos = {
                    x: e.touches[0].clientX,
                };
            } else {
                if (typeof this.lastMPos.x != 'undefined') {
                    //calculate how far the mouse has moved
                    var deltaX = this.lastMPos.x - e.clientX;
    
                    if (this.first) {
                        deltaX = 0;
                    }
                    this.first = false;
    
                    //rotate your object accordingly
                    this.currentAvatar.rotation.y -= deltaX * 0.01;
                }
    
                //save current mouse Position for next time
                this.lastMPos = {
                    x: e.clientX,
                };
            }
    
    }

	setZoom = (fov) => {
		this.camera.fov = fov;
		if (this.camera.fov < 30) this.camera.fov = 30;
		if (this.camera.fov > 50) this.camera.fov = 50;
		this.camera.updateProjectionMatrix();
	}

    mouseWheelHandler = (e) => {
		const fovDelta = e.deltaY;
		const temp = this.camera.fov + Math.round(fovDelta * 0.04);
		this.setZoom(temp);
	};


    handleRendererMouseMove = (e) => {
		this.rotateAvatar(e);
	};


    handleMouseDown = () => {
		this.canRotate = true;
		this.first = true;
	};

	handleMouseUp = () => {
		this.canRotate = false;
	};

    componentDidMount() {
        setUpEnvMap(this.scene, this.renderer);
        // setUpNormalLights(this.scene, this.renderer);

        this.renderer.domElement.addEventListener('wheel', this.mouseWheelHandler, { passive: true });
        this.renderer.domElement.addEventListener('mousemove', this.handleRendererMouseMove, true);
        this.renderer.domElement.addEventListener('mouseup',this.handleMouseUp, true);
        this.renderer.domElement.addEventListener('mousedown',this.handleMouseDown, true);

        this.myRef.current.appendChild(this.renderer.domElement);

        this.loadAvatar();
                
        this.animate();

    }

    animate = () => {
        if(!this.active) return;
        requestAnimationFrame(this.animate);
        this.renderer.render(this.scene, this.camera)
    }

    render() {
        return (
            <div className='avatarCreator'>
                <div 
                    onClick={(e) => {
                        debugger;
                        this.active=false;
                        this.closeModal();
                    }}
                    style={{
                        position: 'absolute',
                        cursor: 'pointer',
                        zIndex: 100,
                        right: '-15px',
                        top: '-15px',
                    }}
                >
                    <img
                        src="https://cdn.obsess-vr.com/Close-button.png"
                        style={{
                            maxWidth: '100%',
                            width: '2.5em',
                            float: 'right',
                        }}
                    ></img>
                </div>

                <h1 className='title'>Customize your avatar</h1>

                <div className="editorBody">
                    <AvatarCreatorEditor
                        currentAvatar={this.props.currentAvatar}
                     currentScene={this.scene}/>
                    <div className='avatarCreatorScene' ref={this.myRef}>
                    <TextInput onChange={this._onAvatarNameChange} avatarName={this.avatarName}  />
                    </div>
                </div>

                <div className="editorButtons">
                    <button type='button' className='cancelButton' onClick={()=>{this.closeModal(); this.active=false;}}> Cancel </button>
                    <button type='button' className='saveButton' onClick={()=>{this.saveAvatar(); this.active=false}}> Save </button>
                </div>                     
            </div>
        );
    }
}


export default AvatarCreator;