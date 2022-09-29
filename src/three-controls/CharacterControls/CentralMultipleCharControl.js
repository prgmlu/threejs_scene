import * as THREE from 'three';
import RemoteChar from './RemoteChar';
import { initCSSRenderer, addToolTipToModel } from './toolTipHelpers';
import {
    dressUpFromString
} from './OutfitTranslator';

import {setUpSceneBackground, adjustRenderer} from '../../three-background/threeHelpers';

const ACTIVE = true;
const USE_TOOLTIP = true;


let SOCKET_SERVER_URL = (document.location.href.includes("192.168") || document.location.href.includes("127.0.0") || document.location.href.includes("localhost") ) ? 'http://192.168.1.122:8000/':"https://avbe.beta.obsess-vr.com/";

export default class CentralMultipleCharControls{
    constructor(mainCharControlsObj, otherChars,localAvatarNameRef, femaleLocalAvatarOutfitStringRef,maleLocalAvatarOutfitStringRef, visibleGenderRef,toAddObjsRef, scene, camera){
        this.mainCharControlsObj = mainCharControlsObj;

        window.that = this;
        
        this.localAvatarNameRef = localAvatarNameRef;
        this.femaleLocalAvatarOutfitStringRef = femaleLocalAvatarOutfitStringRef;
        this.maleLocalAvatarOutfitStringRef = maleLocalAvatarOutfitStringRef;
        this.prevFemaleLocalAvatarOutfitString = femaleLocalAvatarOutfitStringRef.current;
        this.prevMaleLocalAvatarOutfitString = maleLocalAvatarOutfitStringRef.current;

        this.visibleGenderRef = visibleGenderRef;

        this.prevLocalAvatarName = localAvatarNameRef.current;

        window.femaleLocalAvatarOutfitStringRef = femaleLocalAvatarOutfitStringRef;
        window.maleLocalAvatarOutfitStringRef = maleLocalAvatarOutfitStringRef;

        this.scene = scene;
        this.camera = camera;


        this.myName = localAvatarNameRef.current;
        
        this.model = mainCharControlsObj.model;
        if(USE_TOOLTIP){
            window.addEventListener('resize',()=>{
                //warning, dangerous if the scene is embedded in a div 
                this.labelRenderer && this.labelRenderer.setSize(window.innerWidth, window.innerHeight);
            })
            this.labelRenderer = initCSSRenderer();
            let {div,tooltipMesh } = addToolTipToModel(this.model,this.myName);
            this.tooltipMesh = tooltipMesh;
            this.tooltipDiv = div;
        }

        this.otherChars = otherChars;

        
        window.otherChars = otherChars;
        this.prevAddresses = [];
        
        //an important field that serves as an id among the other characters
        //get assigned by the server upon connection open
        // if the address is null no messages are sent
        this.address = null;
        
        this.clock = new THREE.Clock();

        if(ACTIVE){
            this.createSocketAndConnect();
            this.socket.on("connect", () => {
                this.sendData(); // x8WIv7-mJelg7on_ALbx
                // this.room = 'general';
                this.ownRoom = 1;
                this.room = this.ownRoom;
                window.setInterval(()=>{
                    this.sendData();
                }
                ,1000);
              });
                this.socket.on('message', this.handleMessage.bind(this));
                this.socket.on('address', this.isNewAddress.bind(this));
                this.socket.on('disconnected', this.handleDisconnect.bind(this));
        }


        // this.update();

        if(!window.mainAnimationLoopHooks) window.mainAnimationLoopHooks = [];


        setUpSceneBackground(this.scene, false);
        adjustRenderer(window.mainRenderer);




        //add all the items inside window.toAddObjs
        //to the scene\

        toAddObjsRef.current.forEach((i)=>{
            this.scene.add(i);
        })

        window.mainAnimationLoopHooks.push(this.update.bind(this));
    }

    createRemoteCharacter(type,position,rotation, address, name, outfitString){
        let newChar = new RemoteChar(type, position, rotation, address, name, USE_TOOLTIP,false,outfitString);
        return newChar
    }

    getCharsByAddress(address){
        return this.otherChars.filter((x)=>x.address == address);
    }

    isNewAddress(data){
            if(!this.address){
                this.address = data;
                this.sendData();
                return true;
            }
            return false
    }

    checkAndHandleIfSomeoneDisconnected(data){
        let addresses = this.prevAddresses.slice();
        let data_addresses = Array.from(Object.keys(data));
        let diff = addresses.filter((x)=>!data_addresses.includes(x));
        //have to handle the rare case of 2 people disconnecting at the same server respone
        if(diff.length > 0){
            for(let address of diff){
                this.handleDisconnect(address);
            }
        }
    }

    purgeRemoteChar(char){
        this.otherChars.splice(this.otherChars.indexOf(char), 1);
        char.removeFromScene();
    }

    handleDisconnect(address){
        let chars = this.getCharsByAddress(address);
        for(let char of chars){
            this.purgeRemoteChar(char);
        }
    }
    disconnectAll(){
        for(let char of this.otherChars){
            char.removeFromScene();
        }
        this.otherChars = [];
    }
    
    
    handleMessage(event){
        let data = JSON.parse(event);

        for(let address in data){
            //ignore your address
            if(address ==this.address)
            continue;
            
            let chars = this.getCharsByAddress(address);
            // console.log(this.room, data[address].room)
            if(!chars[0] && data[address].room == this.room){
                //new character entered
                let femaleChar = this.createRemoteCharacter('female',data[address].position,data[address].rotation, address, data[address].name, data[address].femaleOutfitString);

                let maleChar = this.createRemoteCharacter('male',data[address].position,data[address].rotation, address, data[address].name, data[address].maleOutfitString);

                this.otherChars.push(femaleChar);
                this.otherChars.push(maleChar);

                this.sendData();
            }

            if(chars[0] && chars[0].model && chars[1] && chars[1].model){
                this.updateRemoteChars(chars,data[address]);
            }

        }

        this.prevAddresses = Array.from(Object.keys(data));
        return false;
    }

    updateRemoteChars(chars,data){

        for(let char of chars){
            if(data.room != this.room){
                this.purgeRemoteChar(char);
            }
            if(char.charName != data.name){
                char.updateName(data.name);
            }
            char.interpolateToPosition(data.position);
            
            // char.model.position.copy(data.position);
            char.model.rotation.copy(data.rotation);
            
            data.isWalking? char.playWalkingAnimation():char.playIdleAnimation();
            data.isWaving? char.playWavingAnimation(): null;

            if( (!char.maleOutfitString) || (!char.femaleOutfitString) || (char.femaleOutfitString != data.femaleOutfitString) || (char.maleOutfitString != data.maleOutfitString)){
                char.femaleOutfitString = data.femaleOutfitString;
                char.maleOutfitString = data.maleOutfitString;
                //warning, dress each char appropriately
                if (char.charType == 'male'){
                    dressUpFromString(char.model,data.maleOutfitString);
                }
                if(char.charType == 'female')
                    dressUpFromString(char.model,data.femaleOutfitString);
            }
            
            if(data.visibleType == 'male'){
                if(char.charType == 'male')
                    char.model.visible = true
                else
                    char.model.visible = false
                }

            if(data.visibleType == 'female'){
                if(char.charType == 'female')
                    char.model.visible = true
                else
                    char.model.visible = false
            }
        }
    }


    createSocketAndConnect(){
            var io = require('socket.io-client');
            this.socket = io.connect(SOCKET_SERVER_URL,{rejectUnauthorized: false });
            window.socket = this.socket;
    }

    isShopTogetherSession(params){
        return (params.has('shoptogether') || localStorage.getItem('shoptogether')) && (!this.shoptogether) && isSessionActive;
    }
    sendData(){
        if(!this.scene.children.includes(window.model)) return;
        let address = this.address;
        if( !address)
            return;
            
        let data = {};
        data[address] = {};
        
        let params = new URLSearchParams(window.location.search);
        let isSessionActive = localStorage.getItem('isSessionActive');
        isSessionActive = isSessionActive == 'true'? true:false;

        window.isSessionActive = isSessionActive;

        data[address].isSessionActive = isSessionActive;
        data[address].shoptogether = this.sessionId;

        // if it's the first time the session is active
        if( this.isShopTogetherSession(params) ){
            this.sessionId = params.has('shoptogether')? params.get('shoptogether'):localStorage.getItem('shoptogether');
            data[address].shoptogether = this.sessionId;
            
            this.disconnectAll();
            this.shoptogether = true;
            
            this.socket.emit('chooseRoom',this.sessionId);
            this.room = this.sessionId;
        }


        // if a user ends his session
        if(this.shoptogether && !isSessionActive){
            this.socket.emit('sessionDisconnect')
            this.disconnectAll();
            this.shoptogether = false;
            this.socket.emit('chooseRoom',this.ownRoom);
            this.room = this.ownRoom;
            // this.socket.emit('chooseRoom','general');
            // this.room = 'general';
        }
        // else data[address].shoptogether = null;
            
        data[address].position = this.mainCharControlsObj.model.position;
        data[address].rotation = this.mainCharControlsObj.model.rotation;
        data[address].isWalking = this.mainCharControlsObj.isWalking;
        data[address].isWaving = this.mainCharControlsObj.isWaving;
        data[address].room = this.room;
        // data[address].visibleType = 'female';
        data[address].visibleType = this.visibleGenderRef.current;

        data[address].femaleOutfitString = this.femaleLocalAvatarOutfitStringRef.current;
        data[address].maleOutfitString = this.maleLocalAvatarOutfitStringRef.current;

        if(this.localAvatarNameRef.current){
            data[address].name = this.localAvatarNameRef.current;
            if(this.myName != this.localAvatarNameRef.current){
                this.myName = this.localAvatarNameRef.current;
                this.tooltipDiv.textContent = this.localAvatarNameRef.current;
            }
        }
        else{
            data[address].name = this.myName;
        }
        
        this.prevPosition = this.mainCharControlsObj.model.position.clone();
        this.prevRotation = this.mainCharControlsObj.model.rotation.clone();
        this.prevIsWalking = this.mainCharControlsObj.isWalking;
        this.prevIsWaving = this.mainCharControlsObj.isWaving;
        this.prevFemaleOutfitString = this.femaleLocalAvatarOutfitStringRef.current;
        this.prevMaleOutfitString = this.maleLocalAvatarOutfitStringRef.current;
        this.prevLocalAvatarName = this.localAvatarNameRef.current;
        
            if(this.socket.connected){
                this.socket.emit('data',JSON.stringify(data));
            }
    }




    update = () => {
        // window.requestAnimationFrame(this.update);
        if(USE_TOOLTIP){
            this.labelRenderer.render( this.scene, this.camera );
        }

        let updateDelta = this.clock.getDelta()
        this.mainCharControlsObj.update(updateDelta);
        this.otherChars.forEach(char => {
            char.mixer && char.mixer.update(updateDelta);
        });

        if(ACTIVE){

            if(!this.prevPosition){
                this.sendData();
                return;
            }
            if(this.mainCharControlsObj.model.position.distanceTo(this.prevPosition) > 0.01
             || this.mainCharControlsObj.isWalking != this.prevIsWalking
             || this.mainCharControlsObj.isWaving != this.prevIsWaving
             || this.femaleLocalAvatarOutfitStringRef.current != this.prevLocalAvatarOutfitString
             || this.maleLocalAvatarOutfitStringRef.current != this.prevLocalAvatarOutfitString
             || this.localAvatarNameRef.current != this.prevLocalAvatarName)
             {

                this.sendData();
            }
        }
    }
}