import React, { Component, useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import nipplejs from 'nipplejs';
import './JoyStickStyle.css';
import arrow from '../../three-background/RealtimeBackground/static/movement_controller/arrow.png'


export default class JoystickControls extends Component {
    constructor(props) {
        super(props);
        // this.directionValues[0] = 0;
        // this.directionValues[1] = 0;
        // this.directionValues[2] = 0;
        // this.directionValues[3] = 0;

        //fwd, bk, rgt, lft
        // this.directionValues = [
        //     0,0,0,0
        // ]

        this.directionValues = props.directionValues;

        this.tempVector = new THREE.Vector3();
        this.upVector = new THREE.Vector3(0, 1, 0);
        this.joyManager;

        this.scene = this.props.scene;
        this.camera = this.props.camera;
        this.renderer = this.props.renderer;
        this.orbitControls = this.props.orbitControls;

		this.myRef = React.createRef();
    }


    componentDidMount() {
        this.addJoyStick();
        // this.animate();
        
    }

    animate = () => {

        // this.updatePlayer();
        // this.orbitControls.update();
      
        // requestAnimationFrame( this.animate );
      }

    updatePlayer = () => {

        // move the player
        const angle = this.orbitControls.getAzimuthalAngle()

        if (this.directionValues[0] > 0) {
            this.tempVector
                .set(0, 0, -this.directionValues[0])
                .applyAxisAngle(this.upVector, angle)
        }

        if (this.directionValues[1] > 0) {
            this.tempVector
                .set(0, 0, this.directionValues[1])
                .applyAxisAngle(this.upVector, angle)
        }

        if (this.directionValues[3] > 0) {
            this.tempVector
                .set(-this.directionValues[3], 0, 0)
                .applyAxisAngle(this.upVector, angle)
        }

        if (this.directionValues[2] > 0) {
            this.tempVector
                .set(this.directionValues[2], 0, 0)
                .applyAxisAngle(this.upVector, angle)
        }
    }


    addJoyStick = () => {
        {
            const options = {
                zone: this.myRef.current,
                size: 120,
                multitouch: true,
                maxNumberOfNipples: 2,
                mode: 'static',
                restJoystick: true,
                shape: 'circle',
                // position: { top: 20, left: 20 },
                position: { top: '60px', left: '60px' },
                dynamicPage: true,
            }


            this.joyManager = nipplejs.create(options);

            this.joyManager['0'].on('move', (evt, data) => {
                const forward = data.vector.y
                const turn = data.vector.x

                if (forward > 0) {
                    this.directionValues[0] = forward;
                    this.directionValues[1] = 0
                } else if (forward < 0) {
                    this.directionValues[0] = 0
                    this.directionValues[1] = forward;
                }

                if (turn > 0) {
                    this.directionValues[3] = 0
                    this.directionValues[2] = turn;
                } else if (turn < 0) {
                    this.directionValues[3] = turn;
                    this.directionValues[2] = 0
                }
            })

            this.joyManager['0'].on('end', (evt) => {
                this.directionValues[1] = 0
                this.directionValues[0] = 0
                this.directionValues[3] = 0
                this.directionValues[2] = 0
            })

         }
    }


    componentWillUnmount() {
        
    }

    render() {
        return (
            <div id="mobileInterface" className="noSelect">
                <span id="tooltipsJoystick">Use the Joystick to move around</span>
                <div id="joystickWrapper1"
                    ref={this.myRef}
                >
                    <div className="top arrows"> <img src={arrow}  /> </div>
                    <div className="right arrows"> <img src={arrow}  /> </div>
                    <div className="down arrows"> <img src={arrow}  /> </div>
                    <div className="left arrows"> <img src={arrow}  /> </div>
                </div>
                <div id="joystickWrapper2">
                    <div id="jumpButton">
                        <p>JUMP</p>
                    </div>
                </div>
            </div>
        )
    }
}
